-- AlterTable
ALTER TABLE "consumers" ADD COLUMN     "expireBalanceDate" TIMESTAMP(6);

-- CreateTable
CREATE TABLE "consumer_expired_balances" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "consumerId" UUID NOT NULL,
    "balance" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "expireAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consumer_expired_balances_pkey" PRIMARY KEY ("id")
);
