-- AlterTable
ALTER TABLE "store_orders" ADD COLUMN     "companyUserId" UUID;

-- AddForeignKey
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "company_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
