-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('QRCODE', 'DESKTOP');

-- AlterTable
ALTER TABLE "company_payment_methods" ADD COLUMN     "tPag" INTEGER;

-- AlterTable
ALTER TABLE "integration_settings" ADD COLUMN     "type" "IntegrationType" NOT NULL DEFAULT 'DESKTOP',
ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "nfce_qr_codes" ADD COLUMN     "companyUserId" UUID;

-- AddForeignKey
ALTER TABLE "nfce_qr_codes" ADD CONSTRAINT "nfce_qr_codes_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "company_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
