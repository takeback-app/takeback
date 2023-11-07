/*
  Warnings:

  - You are about to drop the column `companyId` on the `company_transfers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "company_transfers" DROP CONSTRAINT "company_transfers_companyId_fkey";

-- AlterTable
ALTER TABLE "company_transfers" DROP COLUMN "companyId";
