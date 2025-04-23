/*
  Warnings:

  - A unique constraint covering the columns `[shortCode]` on the table `urls` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "urls_shortCode_key" ON "urls"("shortCode");
