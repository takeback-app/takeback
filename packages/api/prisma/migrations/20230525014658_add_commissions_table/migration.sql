-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('CASHBACK', 'MONTHLY_PAYMENT');

-- CreateTable
CREATE TABLE "commissions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" "CommissionType" NOT NULL DEFAULT 'CASHBACK',
    "value" DOUBLE PRECISION NOT NULL,
    "representativeId" UUID NOT NULL,
    "transactionId" INTEGER,
    "companyMonthlyPaymentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_companyMonthlyPaymentId_fkey" FOREIGN KEY ("companyMonthlyPaymentId") REFERENCES "company_monthly_payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "representatives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
