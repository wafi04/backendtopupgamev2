/*
  Warnings:

  - You are about to drop the column `userId` on the `memberships` table. All the data in the column will be lost.
  - Added the required column `username` to the `memberships` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "memberships_userId_idx";

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "is_manual" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "memberships_username_idx" ON "memberships"("username");
