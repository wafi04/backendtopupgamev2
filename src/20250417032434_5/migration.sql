/*
  Warnings:

  - You are about to drop the column `is_manual_process` on the `layanans` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "layanans_is_manual_process_idx";

-- AlterTable
ALTER TABLE "layanans" DROP COLUMN "is_manual_process";
