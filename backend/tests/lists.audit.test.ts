import "dotenv/config";
import { test, before, after, mock } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";
import jwt from "jsonwebtoken";

// Real PostgreSQL, exclusively in a freshly created disposable database.
// No reset, seed, truncation or writes to the development database.
const databaseName = `lists_audit_${randomUUID().replaceAll("-", "")}`;
const originalDatabaseUrl = process.env.DATABASE_URL!;
let admin: pg.Client;
let createdDatabase = false;
let app: typeof import("../src/app.js").app;
let prisma: typeof import("../src/lib/prisma.js").prisma;
let browser: any;
let vite: any;
let apiUrl: string;
let uiUrl: string;
let workspaceId: string;
let foreignBoardId: string;
const users: Record<string, { id: string; name: string; email: string; token: string }> = {};

before(async () => {
  assert.match(databaseName, /^lists_audit_[a-f0-9]{32}$/);
  assert.ok(originalDatabaseUrl, "DATABASE_URL must be configured; it is never printed.");
  admin = new pg.Client({ connectionString: originalDatabaseUrl, connectionTimeoutMillis: 5000 });
  await admin.connect();
  await admin.query(`CREATE DATABASE "${databaseName}"`);
  createdDatabase = true;
  console.log(`Isolated audit database: ${databaseName}`);
  const isolatedUrl = new URL(originalDatabaseUrl);
  isolatedUrl.pathname = `/${databaseName}`;
  process.env.DATABASE_URL = isolatedUrl.toString();
  process.env.NODE_ENV = "test";
  const db = new pg.Client({ connectionString: isolatedUrl.toString() });
  await db.connect();
  try {
    const migrations = new URL("../prisma/migrations/", import.meta.url);
    for (const name of (await readdir(migrations)).filter((name) => /^\d/.test(name)).sort()) {
      await db.query(await readFile(new URL(`${name}/migration.sql`, migrations), "utf8"));
    }
  } finally { await db.end(); }
  ({ app } = await import("../src/app.js"));
  ({ prisma } = await import("../src/lib/prisma.js"));
  mock.method(console, "error", () => {}); // Expected 4xx/5xx must not flood logs.
  apiUrl = await app.listen({ host: "127.0.0.1", port: 0 });
  const workspace = await prisma.workspace.create({ data: { name: "Lists audit isolated" } });
  workspaceId = workspace.id;
  for (const role of ["OWNER", "ADMIN", "MEMBER", "VIEWER", "OUTSIDER"]) {
    const user = await prisma.user.create({ data: { name: role, email: `${role.toLowerCase()}@lists-audit.invalid`, passwordHash: "test-only-no-login" } });
    users[role] = { id: user.id, name: user.name, email: user.email, token: jwt.sign({}, process.env.JWT_SECRET!, { subject: user.id, expiresIn: "1h" }) };
    if (role !== "OUTSIDER") await prisma.workspaceMember.create({ data: { workspaceId, userId: user.id, role: role as any } });
  }
  const otherWorkspace = await prisma.workspace.create({ data: { name: "Other isolated workspace" } });
  await prisma.workspaceMember.create({ data: { workspaceId: otherWorkspace.id, userId: users.OUTSIDER.id, role: "OWNER" } });
  const foreign = await prisma.board.create({ data: { title: "Foreign", workspaceId: otherWorkspace.id, createdById: users.OUTSIDER.id,
    members: { create: { userId: users.OUTSIDER.id, role: "OWNER" } } } });
  foreignBoardId = foreign.id;
}, { timeout: 30000 });

after(async () => {
  await browser?.close();
  await vite?.close();
  await app?.close();
  await prisma?.$disconnect();
  if (admin && createdDatabase) {
    // Only the generated identifier above can ever be dropped.
    assert.match(databaseName, /^lists_audit_[a-f0-9]{32}$/);
    await admin.query(`DROP DATABASE IF EXISTS "${databaseName}" WITH (FORCE)`);
    console.log(`Removed isolated audit database: ${databaseName}`);
    await admin.end();
  }
  process.env.DATABASE_URL = originalDatabaseUrl;
  mock.restoreAll();
});

async function board() {
  return prisma.board.create({ data: { title: `Audit ${randomUUID()}`, workspaceId, createdById: users.OWNER.id,
    members: { create: ["OWNER", "ADMIN", "MEMBER", "VIEWER"].map((role) => ({ userId: users[role].id, role: role as any })) } } });
}
async function list(boardId: string, title = "A fazer", position = 0) {
  return prisma.boardList.create({ data: { boardId, title, position } });
}
async function request(method: string, url: string, payload?: object, role = "OWNER") {
  return app.inject({ method: method as any, url, payload, headers: { authorization: `Bearer ${users[role].token}` } });
}
function status(response: any, expected: number) {
  assert.equal(response.statusCode, expected, response.body);
}

for (const role of ["OWNER", "ADMIN", "MEMBER"]) {
  test(`API ${role}: create, read, edit, reorder and delete`, async () => {
    const b = await board();
    const first = await request("POST", `/boards/${b.id}/lists`, { title: "  Primeira  " }, role);
    status(first, 201);
    assert.equal(first.json().list.title, "Primeira");
    const second = await list(b.id, "Segunda", 1);
    const edited = await request("PATCH", `/lists/${first.json().list.id}`, { title: "Alterada" }, role);
    status(edited, 200);
    assert.equal(edited.json().list.position, 0);
    status(await request("PATCH", `/boards/${b.id}/lists/reorder`, { listIds: [second.id, first.json().list.id] }, role), 200);
    const ordered = await request("GET", `/boards/${b.id}/lists`, undefined, role);
    status(ordered, 200);
    assert.deepEqual(ordered.json().lists.map((l: any) => l.id), [second.id, first.json().list.id]);
    status(await request("DELETE", `/lists/${second.id}`, undefined, role), 200);
    const remaining = (await request("GET", `/boards/${b.id}/lists`, undefined, role)).json().lists;
    assert.equal(remaining.length, 1);
    assert.equal(remaining[0].position, 0);
  });
}
for (const title of ["", "   ", "x".repeat(101)]) {
  for (const operation of ["create", "edit"]) test(`API validation ${operation}: title length ${title.length}`, async () => {
    const b = await board();
    const l = await list(b.id);
    status(await request(operation === "create" ? "POST" : "PATCH", operation === "create" ? `/boards/${b.id}/lists` : `/lists/${l.id}`, { title }), 400);
    assert.equal((await prisma.boardList.findUniqueOrThrow({ where: { id: l.id } })).title, "A fazer");
  });
}
test("API title limit 100, ignored creation fields and invalid UUID", async () => {
  const b = await board();
  status(await request("POST", `/boards/${b.id}/lists`, { title: "x".repeat(100) }), 201);
  const ignored = await request("POST", `/boards/${b.id}/lists`, { title: "OK", position: 10 });
  status(ignored, 201);
  assert.equal(ignored.json().list.position, 1);
  for (const method of ["PATCH", "DELETE"]) status(await request(method, "/lists/not-a-uuid", method === "PATCH" ? { title: "OK" } : undefined), 400);
  status(await request("GET", "/boards/not-a-uuid/lists"), 400);
});
test("API empty board, multiple lists and position ordering", async () => {
  const b = await board();
  assert.deepEqual((await request("GET", `/boards/${b.id}/lists`)).json().lists, []);
  await list(b.id, "Last", 2); await list(b.id, "First", 0); await list(b.id, "Middle", 1);
  assert.deepEqual((await request("GET", `/boards/${b.id}/lists`)).json().lists.map((l: any) => l.position), [0, 1, 2]);
});
for (const role of ["VIEWER", "OUTSIDER"]) test(`API ${role}: denied mutations and board isolation`, async () => {
  const b = await board(); const l = await list(b.id);
  const code = role === "VIEWER" ? 403 : 404;
  status(await request("GET", `/boards/${b.id}/lists`, undefined, role), role === "VIEWER" ? 200 : 404);
  status(await request("POST", `/boards/${b.id}/lists`, { title: "Denied" }, role), code);
  status(await request("PATCH", `/lists/${l.id}`, { title: "Denied" }, role), code);
  status(await request("DELETE", `/lists/${l.id}`, undefined, role), code);
  status(await request("PATCH", `/boards/${b.id}/lists/reorder`, { listIds: [l.id] }, role), code);
  assert.equal((await prisma.boardList.findUniqueOrThrow({ where: { id: l.id } })).title, "A fazer");
});
test("API nonexistent board and list", async () => {
  const id = randomUUID();
  status(await request("GET", `/boards/${id}/lists`), 404);
  status(await request("POST", `/boards/${id}/lists`, { title: "Missing" }), 404);
  status(await request("PATCH", `/lists/${id}`, { title: "Missing" }), 404);
  status(await request("DELETE", `/lists/${id}`), 404);
});
for (const authorization of [undefined, "Bearer nonsense", "Bearer", "Bearer expired"]) test(`API JWT rejects ${authorization ?? "missing"}`, async () => {
  const b = await board(); const l = await list(b.id);
  const expired = jwt.sign({}, process.env.JWT_SECRET!, { subject: users.OWNER.id, expiresIn: -1 });
  const headers = authorization ? { authorization: authorization === "Bearer expired" ? `Bearer ${expired}` : authorization } : {};
  for (const [method, url, payload] of [["GET", `/boards/${b.id}/lists`, undefined], ["POST", `/boards/${b.id}/lists`, { title: "X" }], ["PATCH", `/lists/${l.id}`, { title: "X" }], ["DELETE", `/lists/${l.id}`, undefined], ["PATCH", `/boards/${b.id}/lists/reorder`, { listIds: [l.id] }]] as const) {
    status(await app.inject({ method, url, payload, headers }), 401);
  }
});
for (const order of ["identical", "duplicate", "missing", "foreign", "nonexistent"]) test(`API reorder ${order}`, async () => {
  const b = await board(); const a = await list(b.id); const c = await list(b.id, "B", 1);
  const foreign = await list(foreignBoardId, "Foreign");
  const ids = order === "duplicate" ? [a.id, a.id] : order === "missing" ? [a.id] : order === "foreign" ? [a.id, foreign.id] : order === "nonexistent" ? [a.id, randomUUID()] : [a.id, c.id];
  const response = await request("PATCH", `/boards/${b.id}/lists/reorder`, { listIds: ids });
  status(response, order === "identical" ? 200 : 400);
  if (order === "identical") assert.deepEqual(Object.keys(response.json()), ["message"]);
  assert.deepEqual((await request("GET", `/boards/${b.id}/lists`)).json().lists.map((l: any) => l.id), [a.id, c.id]);
});
test("API parallel reorder retains complete collection and contiguous positions", async () => {
  const b = await board(); const a = await list(b.id); const c = await list(b.id, "B", 1); const d = await list(b.id, "C", 2);
  const orders = [[d.id, c.id, a.id], [c.id, a.id, d.id]];
  const results = await Promise.all(orders.map((listIds) => request("PATCH", `/boards/${b.id}/lists/reorder`, { listIds })));
  results.forEach((r) => status(r, 200));
  const confirmed = (await request("GET", `/boards/${b.id}/lists`)).json().lists;
  assert.deepEqual(confirmed.map((l: any) => l.position), [0, 1, 2]);
  assert.ok(orders.some((ids) => JSON.stringify(ids) === JSON.stringify(confirmed.map((l: any) => l.id))));
});
test("API parallel creation assigns different positions", async () => {
  const b = await board();
  const savedErrorLog = console.error;
  const failures: any[] = [];
  console.error = (_message, error) => { failures.push({ name: error?.name, code: error?.code, kind: error?.cause?.kind, adapterKind: error?.meta?.driverAdapterError?.cause?.kind }); };
  const results = await Promise.all(["Concurrent A", "Concurrent B"].map((title) => request("POST", `/boards/${b.id}/lists`, { title })));
  console.error = savedErrorLog;
  assert.equal(failures.length, 0, JSON.stringify(failures));
  results.forEach((r) => status(r, 201));
  assert.deepEqual((await request("GET", `/boards/${b.id}/lists`)).json().lists.map((l: any) => l.position), [0, 1]);
});
test("API rejects non-Bearer authentication and signed token without subject", async () => {
  const b = await board();
  for (const authorization of [`Basic ${users.OWNER.token}`, `Bearer ${jwt.sign({}, process.env.JWT_SECRET!)}`]) {
    status(await app.inject({ method: "GET", url: `/boards/${b.id}/lists`, headers: { authorization } }), 401);
  }
});
test("API internal error response does not expose exception details", async () => {
  const original = prisma.boardList.findMany;
  prisma.boardList.findMany = (() => { throw new Error("sensitive-audit-sentinel"); }) as any;
  try {
    const b = await board(); const response = await request("GET", `/boards/${b.id}/lists`);
    status(response, 500);
    assert.equal(response.json().message, "Erro interno do servidor");
    assert.ok(!response.body.includes("sensitive-audit-sentinel"));
  } finally { prisma.boardList.findMany = original; }
});

test("Browser audit", { timeout: 240000 }, async (t) => {
  console.log("Browser audit: loading automation tools");
  const { chromium, expect } = await import("../../frontend/node_modules/@playwright/test/index.mjs");
  const { createServer } = await import("../../frontend/node_modules/vite/dist/node/index.js");
  console.log("Browser audit: starting isolated frontend");
  process.env.VITE_API_URL = apiUrl;
  vite = await createServer({ root: fileURLToPath(new URL("../../frontend/", import.meta.url)), server: { host: "127.0.0.1", port: 0 } });
  await vite.listen();
  console.log("Browser audit: starting headless Edge");
  uiUrl = `http://127.0.0.1:${vite.httpServer.address().port}`;
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const gates: Array<ReturnType<typeof Promise.withResolvers<void>>> = [];
  t.after(() => { for (const gate of gates) gate.resolve(); });
  console.log(`Browser audit: Edge ${browser.version()}`);
  async function open(role = "OWNER", viewport = { width: 1280, height: 900 }, touch = false) {
    const b = await board();
    console.log(`Browser audit: opening ${b.id} as ${role}`);
    const context = await browser.newContext({ viewport, hasTouch: touch, isMobile: touch });
    context.setDefaultTimeout(8000);
    context.setDefaultNavigationTimeout(10000);
    await context.addInitScript((user: any) => {
      localStorage.setItem("@clone-trello:token", user.token);
      localStorage.setItem("@clone-trello:user", JSON.stringify({ id: user.id, name: user.name, email: user.email, avatarUrl: null }));
    }, users[role]);
    const page = await context.newPage();
    return { b, context, page, goto: () => page.goto(`${uiUrl}/boards/${b.id}`) };
  }
  await t.test("empty, create validation, edit/escape, delete cancel/confirm, no reload", async () => {
    const { b, context, page, goto } = await open();
    let navigations = 0; page.on("framenavigated", (frame: any) => { if (frame === page.mainFrame()) navigations++; });
    await goto();
    console.log("Browser CRUD: page loaded");
    await expect(page.getByText("Nenhuma List disponível")).toBeVisible();
    navigations = 0;
    await page.getByRole("button", { name: "+ Adicionar outra List", exact: true }).click();
    await page.getByRole("button", { name: "Criar List", exact: true }).click();
    await expect(page.getByText("Informe o título da List.")).toBeVisible();
    await page.getByLabel("Título da List", { exact: true }).fill("  Browser List  ");
    await page.getByRole("button", { name: "Criar List", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Browser List", exact: true })).toBeVisible();
    console.log("Browser CRUD: created");
    await page.getByRole("button", { name: "Editar título da List Browser List", exact: true }).click();
    await page.getByLabel("Título da List", { exact: true }).fill("Cancelado");
    await page.getByLabel("Título da List", { exact: true }).press("Escape");
    await expect(page.getByRole("heading", { name: "Browser List", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Editar título da List Browser List", exact: true }).click();
    await page.getByLabel("Título da List", { exact: true }).fill("Alterada Browser");
    await page.getByLabel("Título da List", { exact: true }).press("Enter");
    await expect(page.getByRole("heading", { name: "Alterada Browser", exact: true })).toBeVisible();
    console.log("Browser CRUD: edited");
    await page.getByRole("button", { name: "Excluir List Alterada Browser", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancelar", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Excluir List Alterada Browser", exact: true })).toBeFocused();
    await page.getByRole("button", { name: "Excluir List Alterada Browser", exact: true }).click();
    await page.getByRole("button", { name: "Excluir definitivamente" }).click();
    await expect(page.getByText("List excluída com sucesso.")).toBeVisible();
    console.log("Browser CRUD: deleted");
    assert.equal(await prisma.boardList.count({ where: { boardId: b.id } }), 0);
    assert.equal(navigations, 0);
    await context.close();
  });
  await t.test("VIEWER has no mutation or drag controls; mobile horizontal scrolling", async () => {
    const { b, context, page, goto } = await open("VIEWER", { width: 375, height: 812 });
    for (let i = 0; i < 4; i++) await list(b.id, `Viewer ${i}`, i);
    await goto();
    await expect(page.locator(".board-list-column")).toHaveCount(4);
    await expect(page.locator(".board-list-drag-handle,.board-list-edit-button,.board-list-add-button")).toHaveCount(0);
    assert.ok(await page.locator(".board-lists-container").evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth));
    await context.close();
  });
  await t.test("keyboard reorder persists PATCH then GET", async () => {
    const { b, context, page, goto } = await open();
    const a = await list(b.id, "Keyboard A"); const c = await list(b.id, "Keyboard B", 1);
    await goto();
    const handle = page.getByRole("button", { name: "Mover List Keyboard A", exact: true });
    await handle.focus(); await page.keyboard.press("Space"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("Space");
    await expect(page.getByText("Ordem das Lists salva com sucesso.")).toBeVisible();
    assert.deepEqual((await request("GET", `/boards/${b.id}/lists`)).json().lists.map((l: any) => l.id), [c.id, a.id]);
    await context.close();
  });
  await t.test("mouse reorder persists and Escape cancels without PATCH", async () => {
    const { b, context, page, goto } = await open();
    const a = await list(b.id, "Mouse A"); const c = await list(b.id, "Mouse B", 1);
    await goto();
    const handle = page.getByRole("button", { name: "Mover List Mouse A", exact: true });
    await handle.focus(); await page.keyboard.press("Space"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("Escape");
    assert.deepEqual((await request("GET", `/boards/${b.id}/lists`)).json().lists.map((l: any) => l.id), [a.id, c.id]);
    await expect.poll(() => page.locator(".board-list-sortable").first().evaluate((el: HTMLElement) => getComputedStyle(el).transform)).toBe("none");
    const source = await handle.boundingBox();
    const target = await page.locator(".board-list-sortable").nth(1).boundingBox();
    await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
    await page.mouse.down();
    await page.mouse.move(source.x + source.width / 2 + 12, source.y + source.height / 2, { steps: 3 });
    await expect(page.locator(".is-dragging")).toHaveCount(1);
    await page.mouse.move(target.x + target.width / 2, source.y + source.height / 2, { steps: 15 });
    await expect(page.locator(".is-drop-target")).toHaveCount(1);
    await page.mouse.up();
    await expect(page.getByText("Ordem das Lists salva com sucesso.")).toBeVisible();
    assert.deepEqual((await request("GET", `/boards/${b.id}/lists`)).json().lists.map((l: any) => l.id), [c.id, a.id]);
    await context.close();
  });
  await t.test("edit error preserves draft; delete error preserves modal", async () => {
    const { b, context, page, goto } = await open(); const a = await list(b.id, "Errors");
    await goto();
    await page.route(`**/lists/${a.id}`, (route: any) => route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ message: "Falha simulada" }) }));
    await page.getByRole("button", { name: "Editar título da List Errors", exact: true }).click();
    await page.getByLabel("Título da List", { exact: true }).fill("Rascunho preservado");
    await page.getByRole("button", { name: "Salvar", exact: true }).click();
    await expect(page.getByRole("alert")).toHaveText("Falha simulada");
    await expect(page.getByLabel("Título da List", { exact: true })).toHaveValue("Rascunho preservado");
    await page.getByRole("button", { name: "Cancelar", exact: true }).click();
    await page.getByRole("button", { name: "Excluir List Errors", exact: true }).click();
    await page.getByRole("button", { name: "Excluir definitivamente" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("alert")).toHaveText("Falha simulada");
    await context.close();
  });
  await t.test("reorder POST-commit GET failure locks mutations and sync recovers persisted order", async () => {
    const { b, context, page, goto } = await open(); const a = await list(b.id, "Sync A"); const c = await list(b.id, "Sync B", 1);
    await goto();
    await expect(page.getByRole("button", { name: "Mover List Sync A", exact: true })).toBeVisible();
    await page.route(`**/boards/${b.id}/lists`, (route: any) => route.abort("failed"));
    await page.getByRole("button", { name: "Mover List Sync A", exact: true }).focus();
    await page.keyboard.press("Space"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: "Sincronizar Lists", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "+ Adicionar outra List", exact: true })).toBeDisabled();
    assert.deepEqual((await request("GET", `/boards/${b.id}/lists`)).json().lists.map((l: any) => l.id), [c.id, a.id]);
    await page.unroute(`**/boards/${b.id}/lists`);
    await page.getByRole("button", { name: "Sincronizar Lists", exact: true }).click();
    await expect(page.locator(".board-list-title").first()).toHaveText("Sync B");
    await expect(page.getByRole("button", { name: "+ Adicionar outra List", exact: true })).toBeEnabled();
    await context.close();
  });
  await t.test("late Board load cannot replace current Board", async () => {
    const { b, context, page, goto } = await open(); const next = await board();
    await list(b.id, "Old Board List"); await list(next.id, "Current Board List");
    const ready = Promise.withResolvers<void>(); const release = Promise.withResolvers<void>();
    gates.push(release);
    await page.route(`${apiUrl}/boards/${b.id}`, async (route: any) => {
      const response = await route.fetch(); ready.resolve(); await release.promise; await route.fulfill({ response });
    });
    await goto(); await ready.promise;
    await page.evaluate((url: string) => { history.pushState({}, "", url); window.dispatchEvent(new PopStateEvent("popstate")); }, `/boards/${next.id}`);
    await expect(page.getByRole("heading", { name: "Current Board List", exact: true })).toBeVisible();
    const completed = page.waitForResponse(`${apiUrl}/boards/${b.id}`);
    release.resolve(); await completed;
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await expect(page.getByRole("heading", { name: next.title, exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Old Board List", exact: true })).toHaveCount(0);
    await context.close();
  });
  for (const operation of ["load", "create", "edit", "delete", "reorder"]) {
    await t.test(`late ${operation} response after Board change is ignored`, async () => {
      const { b, context, page, goto } = await open();
      const a = await list(b.id, "Previous A"); await list(b.id, "Previous B", 1);
      const next = await board(); await list(next.id, "Next Board List");
      const ready = Promise.withResolvers<void>(); const release = Promise.withResolvers<void>();
      gates.push(release);
      let requests = 0;
      if (operation !== "load") {
        await goto(); await expect(page.getByRole("heading", { name: "Previous A", exact: true })).toBeVisible();
      }
      const path = operation === "edit" || operation === "delete" ? `**/lists/${a.id}` : operation === "reorder" ? `**/boards/${b.id}/lists/reorder` : `**/boards/${b.id}/lists`;
      const method = operation === "create" ? "POST" : operation === "delete" ? "DELETE" : operation === "load" ? "GET" : "PATCH";
      await page.route(path, async (route: any) => {
        if (route.request().method() !== method) return route.continue();
        requests++;
        const response = await route.fetch(); ready.resolve(); await release.promise;
        await route.fulfill({ response });
      });
      if (operation === "load") await goto();
      if (operation === "create") {
        await page.getByRole("button", { name: "+ Adicionar outra List", exact: true }).click();
        await page.getByLabel("Título da List", { exact: true }).fill("Previous created");
        await page.getByRole("button", { name: "Criar List", exact: true }).click({ clickCount: 2 });
      }
      if (operation === "edit") {
        await page.getByRole("button", { name: "Editar título da List Previous A", exact: true }).click();
        await page.getByLabel("Título da List", { exact: true }).fill("Previous edited");
        await page.getByRole("button", { name: "Salvar", exact: true }).click({ clickCount: 2 });
      }
      if (operation === "delete") {
        await page.getByRole("button", { name: "Excluir List Previous A", exact: true }).click();
        await page.getByRole("button", { name: "Excluir definitivamente" }).click({ clickCount: 2 });
      }
      if (operation === "reorder") {
        await page.getByRole("button", { name: "Mover List Previous A", exact: true }).focus();
        await page.keyboard.press("Space"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("Space");
      }
      await ready.promise;
      if (operation === "delete") {
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(page.locator("dialog .danger-button")).toBeDisabled();
      }
      if (operation === "reorder") await expect(page.getByRole("button", { name: "+ Adicionar outra List", exact: true })).toBeDisabled();
      await page.evaluate((url: string) => { history.pushState({}, "", url); window.dispatchEvent(new PopStateEvent("popstate")); }, `/boards/${next.id}`);
      await expect(page.getByRole("heading", { name: "Next Board List", exact: true })).toBeVisible();
      const completed = page.waitForResponse((response: any) => response.url().includes(operation === "edit" || operation === "delete" ? `/lists/${a.id}` : `/boards/${b.id}/lists`) && response.request().method() === method);
      release.resolve(); await completed;
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      if (operation !== "load") assert.equal(requests, 1);
      else assert.ok(requests >= 1); // React StrictMode repeats mount effects in development.
      await expect(page.locator(".board-list-title")).toHaveText(["Next Board List"]);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await context.close();
    });
  }
  await t.test("touch drag persists", async () => {
    const { b, context, page, goto } = await open("OWNER", { width: 900, height: 900 }, true);
    const a = await list(b.id, "Touch A"); const c = await list(b.id, "Touch B", 1);
    await goto();
    const handle = page.getByRole("button", { name: "Mover List Touch A", exact: true });
    await expect(handle).toBeVisible();
    await handle.scrollIntoViewIfNeeded();
    const source = await handle.boundingBox(); const target = await page.locator(".board-list-sortable").nth(1).boundingBox();
    const session = await context.newCDPSession(page);
    const y = source.y + source.height / 2;
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: source.x + source.width / 2, y }] });
    await expect(page.locator(".is-dragging")).toHaveCount(1);
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: target.x + target.width / 2, y }] });
    await expect(page.locator(".is-drop-target")).toHaveCount(1);
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(page.getByText("Ordem das Lists salva com sucesso.")).toBeVisible();
    assert.deepEqual((await request("GET", `/boards/${b.id}/lists`)).json().lists.map((l: any) => l.id), [c.id, a.id]);
    await context.close();
  });
  await t.test("permission revoked during edit returns 403 without modifying list", async () => {
    const { b, context, page, goto } = await open("MEMBER"); const a = await list(b.id, "Permission");
    await goto();
    await page.route(`**/lists/${a.id}`, async (route: any) => {
      await prisma.boardMember.update({ where: { boardId_userId: { boardId: b.id, userId: users.MEMBER.id } }, data: { role: "VIEWER" } });
      await route.continue();
    });
    await page.getByRole("button", { name: "Editar título da List Permission", exact: true }).click();
    await page.getByLabel("Título da List", { exact: true }).fill("Denied draft");
    await page.getByRole("button", { name: "Salvar", exact: true }).click();
    await expect(page.getByRole("alert")).toContainText("Você não tem permissão");
    await expect(page.getByLabel("Título da List", { exact: true })).toHaveValue("Denied draft");
    assert.equal((await prisma.boardList.findUniqueOrThrow({ where: { id: a.id } })).title, "Permission");
    await page.reload(); await expect(page.getByRole("heading", { name: "Permission", exact: true })).toBeVisible();
    await expect(page.locator(".board-list-drag-handle,.board-list-edit-button,.board-list-add-button")).toHaveCount(0);
    await context.close();
  });
  await t.test("dialog focus wraps; Cancel and close button preserve list", async () => {
    const { b, context, page, goto } = await open(); await list(b.id, "Dialog focus");
    await goto();
    const trigger = page.getByRole("button", { name: "Excluir List Dialog focus", exact: true });
    await trigger.click();
    await expect(page.getByRole("button", { name: "Cancelar", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Excluir definitivamente" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Fechar modal", exact: true })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("button", { name: "Excluir definitivamente" })).toBeFocused();
    await page.getByRole("button", { name: "Cancelar", exact: true }).click();
    await expect(trigger).toBeFocused();
    await trigger.click(); await page.getByRole("button", { name: "Fechar modal", exact: true }).click();
    await expect(trigger).toBeFocused();
    assert.equal(await prisma.boardList.count({ where: { boardId: b.id } }), 1);
    await context.close();
  });
  await t.test("unchanged title and unchanged order do not send PATCH", async () => {
    const { b, context, page, goto } = await open(); await list(b.id, "Unchanged");
    await goto();
    let patches = 0;
    page.on("request", (r: any) => { if (r.method() === "PATCH") patches++; });
    await page.getByRole("button", { name: "Editar título da List Unchanged", exact: true }).click();
    await page.getByLabel("Título da List", { exact: true }).press("Enter");
    await page.getByRole("button", { name: "Mover List Unchanged", exact: true }).focus();
    await page.keyboard.press("Space"); await page.keyboard.press("Space");
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(patches, 0);
    await context.close();
  });
});
