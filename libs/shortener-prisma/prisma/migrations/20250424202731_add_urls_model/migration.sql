-- CreateTable
CREATE TABLE "urls" (
    "id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "urls_shortCode_key" ON "urls"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "urls_shortUrl_key" ON "urls"("shortUrl");
