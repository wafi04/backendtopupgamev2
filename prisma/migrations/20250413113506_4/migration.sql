/*
  Warnings:

  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `whatsapp` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `api_key` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "sub_categories" DROP CONSTRAINT "sub_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "verification_tokens" DROP CONSTRAINT "verification_tokens_username_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "whatsapp" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "role" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "api_key" SET DATA TYPE VARCHAR(64);

-- CreateTable
CREATE TABLE "methods" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(55) NOT NULL,
    "images" VARCHAR(250) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "keterangan" VARCHAR(250) NOT NULL,
    "tipe" VARCHAR(225) NOT NULL,
    "min" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "type_tax" TEXT,
    "tax_admin" INTEGER,
    "min_expired" INTEGER DEFAULT 0,
    "max_expired" INTEGER DEFAULT 0,
    "max" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "methods_code_idx" ON "methods"("code");
