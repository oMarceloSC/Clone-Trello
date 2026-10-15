-- CreateTable
CREATE TABLE "BoardList" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "boardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BoardList_boardId_idx" ON "BoardList"("boardId");

-- CreateIndex
CREATE INDEX "BoardList_boardId_position_idx" ON "BoardList"("boardId", "position");

-- AddForeignKey
ALTER TABLE "BoardList" ADD CONSTRAINT "BoardList_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
