/*
  Warnings:

  - A unique constraint covering the columns `[nfceId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "nfceId" UUID,
ADD COLUMN     "validatedByNfce" BOOLEAN;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_nfceId_key" ON "transactions"("nfceId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_nfceId_fkey" FOREIGN KEY ("nfceId") REFERENCES "nfce"("id") ON DELETE SET NULL ON UPDATE CASCADE;
