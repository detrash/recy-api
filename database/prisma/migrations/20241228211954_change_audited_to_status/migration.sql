/*
  Warnings:

  - You are about to drop the column `audited` on the `Audit` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('PENDING', 'AUDITED', 'FINALIZED');

-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "audited",
ADD COLUMN     "status" "AuditStatus" NOT NULL DEFAULT 'PENDING';
