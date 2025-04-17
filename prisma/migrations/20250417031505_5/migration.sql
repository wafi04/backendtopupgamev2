/*
  Warnings:

  - You are about to drop the column `isActive` on the `methods` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `created_at` on table `kategoris` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `kategoris` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `methods` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `methods` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sub_categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `sub_categories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "kategoris" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "methods" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "images" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "sub_categories" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" VARCHAR(100);

-- CreateTable
CREATE TABLE "layanans" (
    "id" SERIAL NOT NULL,
    "kategori_id" INTEGER NOT NULL,
    "details_id" TEXT,
    "sub_category_id" INTEGER NOT NULL DEFAULT 0,
    "layanan" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "harga" DECIMAL(65,30) NOT NULL,
    "harga_reseller" DECIMAL(65,30) NOT NULL,
    "harga_platinum" DECIMAL(65,30) NOT NULL,
    "harga_gold" DECIMAL(65,30) NOT NULL,
    "harga_flash_sale" DECIMAL(65,30) DEFAULT 0,
    "profit" DECIMAL(65,30) NOT NULL DEFAULT 4,
    "profit_reseller" DECIMAL(65,30) NOT NULL DEFAULT 4,
    "profit_platinum" DECIMAL(65,30) NOT NULL DEFAULT 4,
    "profit_gold" DECIMAL(65,30) NOT NULL DEFAULT 4,
    "is_profit_percentage" BOOLEAN NOT NULL DEFAULT true,
    "is_reseller_profit_percentage" BOOLEAN NOT NULL DEFAULT true,
    "is_platinum_profit_percentage" BOOLEAN NOT NULL DEFAULT true,
    "is_gold_profit_percentage" BOOLEAN NOT NULL DEFAULT true,
    "is_flash_sale" BOOLEAN NOT NULL,
    "judul_flash_sale" VARCHAR(255),
    "banner_flash_sale" VARCHAR(255),
    "expired_flash_sale" DATE,
    "catatan" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "provider" TEXT NOT NULL,
    "product_logo" TEXT,
    "is_manual_process" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "layanans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "is_checked_out" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER,
    "layanan_id" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(65,30) NOT NULL,
    "profit" DECIMAL(65,30) NOT NULL,
    "provider_status" TEXT,
    "provider_data" JSONB,
    "provider_sn" TEXT,
    "provider_updated_at" TIMESTAMP(3),
    "nickname" TEXT,
    "game_id" TEXT,
    "game_server" TEXT,
    "is_manual_process" BOOLEAN NOT NULL DEFAULT false,
    "is_proses_ulang" BOOLEAN NOT NULL DEFAULT false,
    "is_proses_manual_at" TIMESTAMP(3),
    "processed_by" TEXT,
    "metadata" JSONB,
    "providerId" TEXT,
    "transaction_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembayarans" (
    "id" SERIAL NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "harga" DECIMAL(65,30) NOT NULL,
    "no_pembayaran" TEXT,
    "no_pembeli" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "metode" TEXT NOT NULL,
    "reference" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "pembayarans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "method" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT,
    "payment_reference" TEXT,
    "payment_data" JSONB,
    "payment_updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "plan_type" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expired_at" TIMESTAMP(3),
    "transaction_id" TEXT,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_benefits" (
    "id" SERIAL NOT NULL,
    "plan_type" TEXT NOT NULL,
    "benefit_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membership_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proses_manual" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "game_username" TEXT NOT NULL,
    "game_server" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proses_manual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_proses_manual" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "noted" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_proses_manual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "layanans_kategori_id_status_idx" ON "layanans"("kategori_id", "status");

-- CreateIndex
CREATE INDEX "layanans_sub_category_id_status_idx" ON "layanans"("sub_category_id", "status");

-- CreateIndex
CREATE INDEX "layanans_provider_id_status_idx" ON "layanans"("provider_id", "status");

-- CreateIndex
CREATE INDEX "layanans_is_flash_sale_expired_flash_sale_idx" ON "layanans"("is_flash_sale", "expired_flash_sale");

-- CreateIndex
CREATE INDEX "layanans_status_is_flash_sale_idx" ON "layanans"("status", "is_flash_sale");

-- CreateIndex
CREATE INDEX "layanans_is_manual_process_idx" ON "layanans"("is_manual_process");

-- CreateIndex
CREATE INDEX "Cart_username_idx" ON "Cart"("username");

-- CreateIndex
CREATE INDEX "CartItem_is_manual_process_idx" ON "CartItem"("is_manual_process");

-- CreateIndex
CREATE INDEX "CartItem_cart_id_idx" ON "CartItem"("cart_id");

-- CreateIndex
CREATE INDEX "CartItem_layanan_id_idx" ON "CartItem"("layanan_id");

-- CreateIndex
CREATE INDEX "CartItem_transaction_id_idx" ON "CartItem"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "pembayarans_transaction_id_key" ON "pembayarans"("transaction_id");

-- CreateIndex
CREATE INDEX "pembayarans_metode_idx" ON "pembayarans"("metode");

-- CreateIndex
CREATE INDEX "pembayarans_transaction_id_idx" ON "pembayarans"("transaction_id");

-- CreateIndex
CREATE INDEX "pembayarans_status_idx" ON "pembayarans"("status");

-- CreateIndex
CREATE INDEX "pembayarans_transaction_id_metode_status_idx" ON "pembayarans"("transaction_id", "metode", "status");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_id_key" ON "transactions"("transaction_id");

-- CreateIndex
CREATE INDEX "transactions_username_idx" ON "transactions"("username");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_method_idx" ON "transactions"("method");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_transaction_id_idx" ON "transactions"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_transaction_id_key" ON "memberships"("transaction_id");

-- CreateIndex
CREATE INDEX "memberships_username_idx" ON "memberships"("username");

-- CreateIndex
CREATE INDEX "memberships_status_idx" ON "memberships"("status");

-- CreateIndex
CREATE INDEX "memberships_plan_type_idx" ON "memberships"("plan_type");

-- CreateIndex
CREATE INDEX "memberships_transaction_id_idx" ON "memberships"("transaction_id");

-- CreateIndex
CREATE INDEX "membership_benefits_plan_type_idx" ON "membership_benefits"("plan_type");

-- CreateIndex
CREATE INDEX "proses_manual_username_idx" ON "proses_manual"("username");

-- CreateIndex
CREATE INDEX "proses_manual_order_id_idx" ON "proses_manual"("order_id");

-- CreateIndex
CREATE INDEX "proses_manual_status_idx" ON "proses_manual"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_proses_manual_username_key" ON "user_proses_manual"("username");

-- CreateIndex
CREATE INDEX "methods_is_active_idx" ON "methods"("is_active");

-- CreateIndex
CREATE INDEX "methods_is_active_code_idx" ON "methods"("is_active", "code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
