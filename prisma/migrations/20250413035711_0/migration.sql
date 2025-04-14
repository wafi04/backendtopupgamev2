-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "whatsapp" SET DATA TYPE TEXT,
ALTER COLUMN "role" SET DATA TYPE TEXT,
ALTER COLUMN "api_key" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "kategoris" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "sub_nama" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "kode" TEXT,
    "server_id" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "thumbnail" TEXT NOT NULL,
    "tipe" TEXT NOT NULL DEFAULT 'game',
    "petunjuk" TEXT,
    "ket_layanan" TEXT,
    "ket_id" TEXT,
    "placeholder_1" TEXT NOT NULL,
    "placeholder_2" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "bannerlayanan" TEXT NOT NULL,

    CONSTRAINT "kategoris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_categories" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kategoris_kode_key" ON "kategoris"("kode");

-- CreateIndex
CREATE INDEX "kategoris_tipe_status_idx" ON "kategoris"("tipe", "status");

-- CreateIndex
CREATE INDEX "sub_categories_code_category_id_active_idx" ON "sub_categories"("code", "category_id", "active");

-- CreateIndex
CREATE INDEX "sub_categories_category_id_idx" ON "sub_categories"("category_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "kategoris"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
