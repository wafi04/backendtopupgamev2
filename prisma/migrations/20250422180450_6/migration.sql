/*
  Warnings:

  - You are about to drop the column `is_gold_profit_percentage` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `profit_gold` on the `products` table. All the data in the column will be lost.
  - Added the required column `profit_regular` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "is_gold_profit_percentage",
DROP COLUMN "profit_gold",
ADD COLUMN     "is_regular_profit_percentage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profit_regular" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "banner_flash_sale" SET DATA TYPE TEXT;
