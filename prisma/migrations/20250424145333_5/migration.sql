-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "method" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "transactions_method_idx" ON "transactions"("method");
