-- AlterTable
ALTER TABLE "payment_plans" ADD COLUMN     "canSendBirthdayNotification" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "birthday_notifications" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "birthday_notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "birthday_notifications" ADD CONSTRAINT "birthday_notifications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
