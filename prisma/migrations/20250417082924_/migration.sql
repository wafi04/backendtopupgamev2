/*
  Warnings:

  - You are about to drop the column `id_token` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `expired_at` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `payment_data` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `payment_reference` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `payment_updated_at` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kategoris` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `layanans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `membership_benefits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pembayarans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proses_manual` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_proses_manual` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "memberships_transaction_id_idx";

-- DropIndex
DROP INDEX "memberships_username_idx";

-- DropIndex
DROP INDEX "sub_categories_code_category_id_active_idx";

-- DropIndex
DROP INDEX "transactions_method_idx";

-- DropIndex
DROP INDEX "transactions_transaction_id_idx";

-- DropIndex
DROP INDEX "transactions_transaction_id_key";

-- DropIndex
DROP INDEX "transactions_type_idx";

-- DropIndex
DROP INDEX "transactions_username_idx";

-- DropIndex
DROP INDEX "users_username_role_whatsapp_idx";

-- DropIndex
DROP INDEX "users_whatsapp_idx";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "id_token",
DROP COLUMN "scope",
DROP COLUMN "session_state",
DROP COLUMN "token_type",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "expired_at",
DROP COLUMN "username",
ADD COLUMN     "is_permanent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "ip_address",
DROP COLUMN "user_agent",
ADD COLUMN     "ipAdress" VARCHAR(100),
ADD COLUMN     "userAgent" VARCHAR(255);

-- AlterTable
ALTER TABLE "sub_categories" ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "description",
DROP COLUMN "payment_data",
DROP COLUMN "payment_reference",
DROP COLUMN "payment_updated_at",
DROP COLUMN "transaction_id",
DROP COLUMN "username",
ADD COLUMN     "is_manual" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transactionId" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isEmailVerified",
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "CartItem";

-- DropTable
DROP TABLE "kategoris";

-- DropTable
DROP TABLE "layanans";

-- DropTable
DROP TABLE "membership_benefits";

-- DropTable
DROP TABLE "pembayarans";

-- DropTable
DROP TABLE "proses_manual";

-- DropTable
DROP TABLE "user_proses_manual";

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "thumbnail" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'game',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "sub_category_id" INTEGER,
    "name" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "regular_price" DECIMAL(65,30),
    "reseller_price" DECIMAL(65,30),
    "member_price" DECIMAL(65,30),
    "is_flash_sale" BOOLEAN NOT NULL DEFAULT false,
    "flash_sale_price" DECIMAL(65,30),
    "flash_sale_until" TIMESTAMP(3),
    "note" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "product_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "profit" DECIMAL(65,30) NOT NULL DEFAULT 4,
    "profit_reseller" DECIMAL(65,30) NOT NULL DEFAULT 4,
    "profit_platinum" DECIMAL(65,30) NOT NULL DEFAULT 4,
    "profit_gold" DECIMAL(65,30) NOT NULL DEFAULT 4,
    "is_profit_percentage" BOOLEAN NOT NULL DEFAULT false,
    "is_reseller_profit_percentage" BOOLEAN NOT NULL DEFAULT false,
    "is_platinum_profit_percentage" BOOLEAN NOT NULL DEFAULT false,
    "is_gold_profit_percentage" BOOLEAN NOT NULL DEFAULT false,
    "title_flash_sale" VARCHAR(255),
    "banner_flash_sale" VARCHAR(255),
    "product_logo" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_items" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "productId" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(65,30) NOT NULL,
    "status" TEXT DEFAULT 'PENDING',
    "game_id" TEXT,
    "game_server" TEXT,
    "nickname" TEXT,
    "message" TEXT,
    "serial_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "method" TEXT NOT NULL,
    "reference" TEXT,
    "customer_number" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payment_number" TEXT,
    "callback_data" JSONB,
    "callback_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_requests" (
    "id" SERIAL NOT NULL,
    "transaction_item_id" INTEGER NOT NULL,
    "processed_by" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "request_data" JSONB,
    "response_data" JSONB,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_orders" (
    "id" SERIAL NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "processed_by" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "request_data" JSONB,
    "response_data" JSONB,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "game_id" TEXT,
    "game_server" TEXT,
    "nickname" TEXT,
    "serial_number" TEXT,
    "message" TEXT,

    CONSTRAINT "manual_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_code_key" ON "categories"("code");

-- CreateIndex
CREATE INDEX "categories_type_status_idx" ON "categories"("type", "status");

-- CreateIndex
CREATE INDEX "products_category_id_status_idx" ON "products"("category_id", "status");

-- CreateIndex
CREATE INDEX "products_sub_category_id_status_idx" ON "products"("sub_category_id", "status");

-- CreateIndex
CREATE INDEX "products_provider_id_status_idx" ON "products"("provider_id", "status");

-- CreateIndex
CREATE INDEX "products_is_flash_sale_idx" ON "products"("is_flash_sale");

-- CreateIndex
CREATE INDEX "transaction_items_transactionId_idx" ON "transaction_items"("transactionId");

-- CreateIndex
CREATE INDEX "transaction_items_productId_idx" ON "transaction_items"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "process_requests_transaction_item_id_idx" ON "process_requests"("transaction_item_id");

-- CreateIndex
CREATE INDEX "process_requests_status_idx" ON "process_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "manual_orders_transaction_id_key" ON "manual_orders"("transaction_id");

-- CreateIndex
CREATE INDEX "manual_orders_status_idx" ON "manual_orders"("status");

-- CreateIndex
CREATE INDEX "manual_orders_transaction_id_idx" ON "manual_orders"("transaction_id");

-- CreateIndex
CREATE INDEX "memberships_userId_idx" ON "memberships"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transactionId_key" ON "transactions"("transactionId");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");

-- RenameIndex
ALTER INDEX "account_user_id_idx" RENAME TO "accounts_userId_idx";

-- RenameIndex
ALTER INDEX "session_user_id_idx" RENAME TO "sessions_userId_idx";
