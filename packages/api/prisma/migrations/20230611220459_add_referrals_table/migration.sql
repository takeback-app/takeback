-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('WAITING', 'APPROVED', 'BONUSING');

-- CreateTable
CREATE TABLE "referrals" (
    "id" UUID NOT NULL,
    "consumerId" UUID NOT NULL,
    "childrenConsumerId" UUID,
    "cpf" TEXT NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'WAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "referrals_cpf_key" ON "referrals"("cpf");

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_childrenConsumerId_fkey" FOREIGN KEY ("childrenConsumerId") REFERENCES "consumers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
