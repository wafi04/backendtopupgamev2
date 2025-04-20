/*
  Warnings:

  - You are about to drop the column `paceholder_2` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "paceholder_2",
ADD COLUMN     "placeholder_2" TEXT;
