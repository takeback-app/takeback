-- CreateEnum
CREATE TYPE "BonusType" AS ENUM ('SELL', 'NEW_USER');

-- CreateTable
CREATE TABLE "bonus" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" "BonusType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "consumerId" UUID NOT NULL,
    "transactionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bonus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bonus" ADD CONSTRAINT "bonus_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
