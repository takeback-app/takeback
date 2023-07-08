-- CreateEnum
CREATE TYPE "NFCePaymentMethod" AS ENUM ('CASH', 'BANK_CHECK', 'CREDIT', 'DEBIT', 'STORE_CREDIT', 'FOOD_VOUCHER', 'MEAL_VOUCHER', 'GIFT_VOUCHER', 'FUEL_VOUCHER', 'BANK_PAYMENT_SLIP', 'BANK_DEPOSIT', 'PIX', 'BANK_TRANSFER', 'CASHBACK', 'NO_PAYMENT', 'OTHER');

-- CreateTable
CREATE TABLE "nfce" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nfce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfce_payments" (
    "id" UUID NOT NULL,
    "nFCeId" UUID NOT NULL,
    "valueInCents" INTEGER NOT NULL,
    "method" "NFCePaymentMethod" NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nfce_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "nfce" ADD CONSTRAINT "nfce_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfce_payments" ADD CONSTRAINT "nfce_payments_nFCeId_fkey" FOREIGN KEY ("nFCeId") REFERENCES "nfce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
