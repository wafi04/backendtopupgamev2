/*
  Warnings:

  - A unique constraint covering the columns `[position]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `position` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "transactions_type_idx";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "position" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_position_key" ON "transactions"("position");
