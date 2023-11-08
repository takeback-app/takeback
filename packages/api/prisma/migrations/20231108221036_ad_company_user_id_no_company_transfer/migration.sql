-- AlterTable
ALTER TABLE "company_transfers" ADD COLUMN     "companySentUserId" UUID;

-- AddForeignKey
ALTER TABLE "company_transfers" ADD CONSTRAINT "company_transfers_companySentUserId_fkey" FOREIGN KEY ("companySentUserId") REFERENCES "company_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
