/*
  Warnings:

  - You are about to alter the column `type` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `provider` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `provider_account_id` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `token_type` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `scope` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `session_state` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `session_token` on the `sessions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `ip_address` on the `sessions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(45)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `username` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `api_key` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `identifier` on the `verification_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `token` on the `verification_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `username` on the `verification_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - A unique constraint covering the columns `[api_key]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "type" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "provider" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "provider_account_id" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "token_type" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "scope" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "session_state" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "session_token" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "ip_address" SET DATA TYPE VARCHAR(45);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "role" SET DEFAULT 'Member',
ALTER COLUMN "api_key" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "verification_tokens" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "identifier" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "token" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "users_api_key_key" ON "users"("api_key");

-- RenameIndex
ALTER INDEX "accounts_userId_idx" RENAME TO "account_user_id_idx";

-- RenameIndex
ALTER INDEX "sessions_userId_idx" RENAME TO "session_user_id_idx";

-- RenameIndex
ALTER INDEX "verification_tokens_username_idx" RENAME TO "verification_token_username_idx";
