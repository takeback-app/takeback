/*
  Warnings:

  - Added the required column `companyId` to the `qr_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "qr_codes" ADD COLUMN     "companyId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
