-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "fatherTransactionId" INTEGER;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fatherTransactionId_fkey" FOREIGN KEY ("fatherTransactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
