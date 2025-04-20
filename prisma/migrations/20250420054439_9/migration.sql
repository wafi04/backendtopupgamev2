/*
  Warnings:

  - You are about to drop the column `serverId` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "serverId",
ADD COLUMN     "server_id" INTEGER NOT NULL DEFAULT 0;
