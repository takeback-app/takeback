/*
  Warnings:

  - You are about to drop the `nfce_qr_codes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "QRCodeType" AS ENUM ('WAITING', 'VALIDATED', 'NOT_VALIDATED');

-- DropForeignKey
ALTER TABLE "nfce_qr_codes" DROP CONSTRAINT "nfce_qr_codes_companyUserId_fkey";

-- DropForeignKey
ALTER TABLE "nfce_qr_codes" DROP CONSTRAINT "nfce_qr_codes_consumerId_fkey";

-- DropTable
DROP TABLE "nfce_qr_codes";

-- DropEnum
DROP TYPE "NFCeQRCodeType";

-- CreateTable
CREATE TABLE "qr_codes" (
    "id" UUID NOT NULL,
    "link" TEXT NOT NULL,
    "consumerId" UUID NOT NULL,
    "companyUserId" UUID,
    "type" "QRCodeType" NOT NULL DEFAULT 'WAITING',
    "retries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "company_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
