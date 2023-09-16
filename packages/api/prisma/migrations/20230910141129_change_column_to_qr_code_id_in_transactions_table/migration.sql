/*
  Warnings:

  - You are about to drop the column `isFromQrCode` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "isFromQrCode",
ADD COLUMN     "qrCodeId" UUID;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "qr_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
