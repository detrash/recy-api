/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Recycler` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `WasteGenerator` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Partner_userId_key" ON "Partner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Recycler_userId_key" ON "Recycler"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WasteGenerator_userId_key" ON "WasteGenerator"("userId");
