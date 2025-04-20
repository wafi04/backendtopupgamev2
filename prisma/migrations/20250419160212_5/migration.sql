/*
  Warnings:

  - Added the required column `sub_name` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "sub_name" VARCHAR(100) NOT NULL;
