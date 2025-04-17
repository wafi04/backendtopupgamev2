/*
  Warnings:

  - You are about to drop the column `productId` on the `transaction_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionItemId]` on the table `transaction_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productCode` to the `transaction_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionItemId` to the `transaction_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "transaction_items_productId_idx";

-- AlterTable
ALTER TABLE "transaction_items" DROP COLUMN "productId",
ADD COLUMN     "productCode" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "transactionItemId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "products_provider_id_key" ON "products"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_items_transactionItemId_key" ON "transaction_items"("transactionItemId");

-- CreateIndex
CREATE INDEX "transaction_items_transactionItemId_idx" ON "transaction_items"("transactionItemId");

-- CreateIndex
CREATE INDEX "transaction_items_productCode_idx" ON "transaction_items"("productCode");
