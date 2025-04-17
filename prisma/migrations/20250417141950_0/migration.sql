-- AlterTable
ALTER TABLE "products" ALTER COLUMN "profit" DROP DEFAULT,
ALTER COLUMN "profit_reseller" DROP DEFAULT,
ALTER COLUMN "profit_platinum" DROP DEFAULT,
ALTER COLUMN "profit_gold" DROP DEFAULT;

-- AlterTable
ALTER TABLE "transaction_items" ADD COLUMN     "reorder" BOOLEAN NOT NULL DEFAULT false;
