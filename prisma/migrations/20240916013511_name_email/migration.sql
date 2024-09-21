/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Recycler` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `WasteGenerator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Recycler` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Recycler` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `WasteGenerator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `WasteGenerator` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Partner_userId_idx";

-- DropIndex
DROP INDEX "Partner_userId_key";

-- DropIndex
DROP INDEX "Recycler_userId_idx";

-- DropIndex
DROP INDEX "Recycler_userId_key";

-- DropIndex
DROP INDEX "WasteGenerator_userId_idx";

-- DropIndex
DROP INDEX "WasteGenerator_userId_key";

-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recycler" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WasteGenerator" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Partner_email_key" ON "Partner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Recycler_email_key" ON "Recycler"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WasteGenerator_email_key" ON "WasteGenerator"("email");

