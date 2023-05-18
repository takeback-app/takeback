-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_CASHBACK', 'CASHBACK_APPROVED', 'NEW_RAFFLE', 'RAFFLE_WINNER');

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "consumerId" UUID,
    "companyUserId" UUID,
    "data" JSONB NOT NULL DEFAULT '{}',
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "company_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
