/*
  Warnings:

  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `regular_price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `reseller_price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `member_price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `flash_sale_price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `profit` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `profit_reseller` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `profit_platinum` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `profit_regular` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "regular_price" SET DATA TYPE INTEGER,
ALTER COLUMN "reseller_price" SET DATA TYPE INTEGER,
ALTER COLUMN "member_price" SET DATA TYPE INTEGER,
ALTER COLUMN "flash_sale_price" SET DATA TYPE INTEGER,
ALTER COLUMN "profit" SET DATA TYPE INTEGER,
ALTER COLUMN "profit_reseller" SET DATA TYPE INTEGER,
ALTER COLUMN "profit_platinum" SET DATA TYPE INTEGER,
ALTER COLUMN "profit_regular" SET DATA TYPE INTEGER;
