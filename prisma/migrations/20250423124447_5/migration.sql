-- CreateTable
CREATE TABLE "Banner" (
    "id" INTEGER NOT NULL,
    "urlImage" TEXT NOT NULL,
    "description" TEXT,
    "title" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);
