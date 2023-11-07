-- CreateTable
CREATE TABLE "company_transfers" (
    "id" SERIAL NOT NULL,
    "value" DECIMAL(10,4) DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companySentId" UUID,
    "companyReceivedId" UUID,
    "companyId" UUID,

    CONSTRAINT "company_transfers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "company_transfers" ADD CONSTRAINT "company_transfers_companySentId_fkey" FOREIGN KEY ("companySentId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_transfers" ADD CONSTRAINT "company_transfers_companyReceivedId_fkey" FOREIGN KEY ("companyReceivedId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_transfers" ADD CONSTRAINT "company_transfers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
