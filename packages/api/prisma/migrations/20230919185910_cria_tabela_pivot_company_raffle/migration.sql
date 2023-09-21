-- CreateTable
CREATE TABLE "company_raffle" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "raffleId" UUID NOT NULL,
    "companyId" UUID NOT NULL,

    CONSTRAINT "company_raffle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "company_raffle" ADD CONSTRAINT "company_raffle_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_raffle" ADD CONSTRAINT "company_raffle_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "raffles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
