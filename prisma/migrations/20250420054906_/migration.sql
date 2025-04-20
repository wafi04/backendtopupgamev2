/*
  Warnings:

  - You are about to drop the column `placeholder1` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `placeholder2` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "placeholder1",
DROP COLUMN "placeholder2",
ADD COLUMN     "paceholder_2" TEXT,
ADD COLUMN     "placeholder_1" TEXT;
