-- AlterTable
ALTER TABLE "raffle_tickets" ADD COLUMN     "transactionId" INTEGER;

-- AddForeignKey
ALTER TABLE "raffle_tickets" ADD CONSTRAINT "raffle_tickets_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
