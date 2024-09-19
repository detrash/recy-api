/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Auditor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Auditor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Auditor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auditor" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "organizationName" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "walletAddress" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Auditor_email_key" ON "Auditor"("email");
