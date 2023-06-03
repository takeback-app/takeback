-- CreateTable
CREATE TABLE "representative_user_companies" (
    "id" SERIAL NOT NULL,
    "companyId" UUID NOT NULL,
    "representativeUserId" UUID NOT NULL,

    CONSTRAINT "representative_user_companies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "representative_user_companies" ADD CONSTRAINT "representative_user_companies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "representative_user_companies" ADD CONSTRAINT "representative_user_companies_representativeUserId_fkey" FOREIGN KEY ("representativeUserId") REFERENCES "representative_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
