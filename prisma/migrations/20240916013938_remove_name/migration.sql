/*
  Warnings:

  - You are about to drop the column `email` on the `Auditor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Auditor` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Recycler` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Recycler` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `RecyclingReport` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `RecyclingReport` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `WasteGenerator` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `WasteGenerator` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Auditor_email_key";

-- DropIndex
DROP INDEX "Partner_email_key";

-- DropIndex
DROP INDEX "Recycler_email_key";

-- DropIndex
DROP INDEX "WasteGenerator_email_key";

-- AlterTable
ALTER TABLE "Auditor" DROP COLUMN "email",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "email",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Recycler" DROP COLUMN "email",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "RecyclingReport" DROP COLUMN "email",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "WasteGenerator" DROP COLUMN "email",
DROP COLUMN "name";
