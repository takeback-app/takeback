-- CreateEnum
CREATE TYPE "TransactionSource" AS ENUM ('APP', 'CHECKOUT');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transactionSource" "TransactionSource";
