/*
  Warnings:

  - You are about to drop the column `is_manual` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `username` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "transactions_userId_idx";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "is_manual",
DROP COLUMN "userId",
ADD COLUMN     "username" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE INDEX "transactions_username_idx" ON "transactions"("username");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");
