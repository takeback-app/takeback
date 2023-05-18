-- CreateEnum
CREATE TYPE "NotificationSolicitationStatus" AS ENUM ('CREATED', 'APPROVED', 'REPROVED');

-- CreateEnum
CREATE TYPE "NotificationSolicitationSex" AS ENUM ('MALE', 'FEMALE', 'ALL');

-- CreateEnum
CREATE TYPE "StoreVisitType" AS ENUM ('NEVER', 'FROM_THE_DATE_OF_PURCHASE', 'ALL');

-- CreateTable
CREATE TABLE "notification_solicitations" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "companyId" UUID NOT NULL,
    "status" "NotificationSolicitationStatus" NOT NULL DEFAULT 'CREATED',
    "audienceSex" "NotificationSolicitationSex" NOT NULL DEFAULT 'ALL',
    "minAudienceAge" INTEGER,
    "maxAudienceAge" INTEGER,
    "audienceBalance" DECIMAL(65,30),
    "storeVisitType" "StoreVisitType" NOT NULL DEFAULT 'ALL',
    "dateOfPurchase" TIMESTAMP(3),
    "hasChildren" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_solicitations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notification_solicitations" ADD CONSTRAINT "notification_solicitations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
