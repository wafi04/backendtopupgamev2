/*
  Warnings:

  - Added the required column `type` to the `verification_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "verification_tokens" ADD COLUMN     "type" VARCHAR(100) NOT NULL;
