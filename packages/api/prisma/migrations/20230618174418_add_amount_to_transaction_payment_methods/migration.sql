-- AlterTable
ALTER TABLE "transaction_payment_methods" ADD COLUMN     "amount" DECIMAL(10,4) NOT NULL DEFAULT 0;
