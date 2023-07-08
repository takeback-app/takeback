/*
  Warnings:

  - Added the required column `issuedAt` to the `nfce` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "nfce_payments" DROP CONSTRAINT "nfce_payments_nFCeId_fkey";

-- AlterTable
ALTER TABLE "nfce" ADD COLUMN     "issuedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "nfce_payments" ADD CONSTRAINT "nfce_payments_nFCeId_fkey" FOREIGN KEY ("nFCeId") REFERENCES "nfce"("id") ON DELETE CASCADE ON UPDATE CASCADE;
