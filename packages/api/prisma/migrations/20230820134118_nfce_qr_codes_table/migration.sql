/*
  Warnings:

  - Made the column `unit` on table `store_products` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NFCeQRCodeType" AS ENUM ('WAITING', 'VALIDATED', 'NOT_VALIDATED');

-- AlterTable
ALTER TABLE "store_products" ALTER COLUMN "unit" SET NOT NULL;

-- CreateTable
CREATE TABLE "nfce_qr_codes" (
    "id" UUID NOT NULL,
    "link" TEXT NOT NULL,
    "consumerId" UUID NOT NULL,
    "type" "NFCeQRCodeType" NOT NULL DEFAULT 'WAITING',
    "retries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nfce_qr_codes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "nfce_qr_codes" ADD CONSTRAINT "nfce_qr_codes_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
