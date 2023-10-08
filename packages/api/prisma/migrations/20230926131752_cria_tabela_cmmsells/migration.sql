-- CreateTable
CREATE TABLE "cmm_sells" (
    "id" SERIAL NOT NULL,
    "sell" JSONB NOT NULL,
    "transactionId" INTEGER NOT NULL,

    CONSTRAINT "cmm_sells_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cmm_sells" ADD CONSTRAINT "cmm_sells_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
