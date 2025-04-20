-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "placeholder1" VARCHAR(255),
ADD COLUMN     "placeholder2" VARCHAR(255),
ADD COLUMN     "serverId" INTEGER NOT NULL DEFAULT 0;
