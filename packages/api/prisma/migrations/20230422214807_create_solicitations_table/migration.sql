-- CreateEnum
CREATE TYPE "SolicitationType" AS ENUM ('CASHBACK', 'PAYMENT');

-- CreateEnum
CREATE TYPE "SolicitationStatus" AS ENUM ('WAITING', 'CANCELED', 'APPROVED');

-- CreateTable
CREATE TABLE "transaction_solicitations" (
    "id" UUID NOT NULL,
    "valueInCents" INTEGER NOT NULL,
    "type" "SolicitationType" NOT NULL,
    "status" "SolicitationStatus" NOT NULL DEFAULT 'WAITING',
    "consumerId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "companyPaymentMethodId" INTEGER NOT NULL,
    "companyUserId" UUID,
    "updatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_solicitations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transaction_solicitations" ADD CONSTRAINT "transaction_solicitations_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_solicitations" ADD CONSTRAINT "transaction_solicitations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_solicitations" ADD CONSTRAINT "transaction_solicitations_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "company_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_solicitations" ADD CONSTRAINT "transaction_solicitations_companyPaymentMethodId_fkey" FOREIGN KEY ("companyPaymentMethodId") REFERENCES "company_payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
