-- DropForeignKey
ALTER TABLE "access_tokens" DROP CONSTRAINT "access_tokens_companyId_fkey";

-- AlterTable
ALTER TABLE "access_tokens" ALTER COLUMN "companyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "access_tokens" ADD CONSTRAINT "access_tokens_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
