import "dotenv/config";
import pg from "pg";

// Recovery for an interrupted audit; default mode only inspects candidates.
const admin = new pg.Client({ connectionString: process.env.DATABASE_URL });
await admin.connect();
try {
  if (process.argv.includes("--inspect-environment")) {
    const table = await admin.query("SELECT to_regclass('public.\"BoardList\"') IS NOT NULL AS exists");
    const version = await admin.query("SHOW server_version");
    console.log(`PostgreSQL ${version.rows[0].server_version}; development BoardList table exists: ${table.rows[0].exists}`);
    for (const port of [3333, 5173]) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(2000) });
        console.log(`Local port ${port}: HTTP ${response.status}`);
      } catch { console.log(`Local port ${port}: unavailable at inspection time`); }
    }
  }
  const { rows } = await admin.query("SELECT datname FROM pg_database WHERE datname LIKE 'lists_audit_%'");
  console.log(`Audit database candidates: ${rows.length}`);
  for (const { datname } of rows) {
    if (!/^lists_audit_[a-f0-9]{32}$/.test(datname)) continue;
    const active = await admin.query("SELECT count(*)::int AS count FROM pg_stat_activity WHERE datname = $1", [datname]);
    if (active.rows[0].count > 0) { console.log(`${datname}: active, untouched`); continue; }
    const url = new URL(process.env.DATABASE_URL);
    url.pathname = `/${datname}`;
    const db = new pg.Client({ connectionString: url.toString() });
    await db.connect();
    let verified = false;
    try {
      const users = await db.query('SELECT email FROM "User" ORDER BY email');
      const marker = await db.query('SELECT count(*)::int AS count FROM "Workspace" WHERE name = $1', ["Lists audit isolated"]);
      verified = marker.rows[0].count === 1 && JSON.stringify(users.rows.map((r) => r.email)) === JSON.stringify(["admin", "member", "outsider", "owner", "viewer"].map((r) => `${r}@lists-audit.invalid`));
    } finally { await db.end(); }
    if (!verified) throw new Error(`Refusing cleanup: ${datname} does not match audit fixtures.`);
    if (process.argv.includes("--remove-verified")) {
      // No FORCE: any newly opened session makes the operation fail safely.
      await admin.query(`DROP DATABASE "${datname}"`);
      console.log(`${datname}: verified interrupted audit removed`);
    } else console.log(`${datname}: verified interrupted audit, not removed`);
  }
} finally { await admin.end(); }
