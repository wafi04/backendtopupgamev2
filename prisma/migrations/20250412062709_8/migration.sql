/*
  Warnings:

  - You are about to drop the column `user_id` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `users` table. All the data in the column will be lost.
  - Added the required column `userId` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `verification_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_whatsapp_otp_idx";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "user_id",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "user_id",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "otp";

-- AlterTable
ALTER TABLE "verification_tokens" ADD COLUMN     "otp" VARCHAR(6),
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "users_whatsapp_idx" ON "users"("whatsapp");

-- CreateIndex
CREATE INDEX "verification_tokens_username_idx" ON "verification_tokens"("username");
