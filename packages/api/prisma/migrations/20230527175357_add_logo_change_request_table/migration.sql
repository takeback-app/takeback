-- CreateEnum
CREATE TYPE "LogoChangeRequestStatus" AS ENUM ('CREATED', 'APPROVED', 'REPROVED');

-- CreateTable
CREATE TABLE "logo_change_requests" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "status" "LogoChangeRequestStatus" NOT NULL DEFAULT 'CREATED',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logo_change_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "logo_change_requests" ADD CONSTRAINT "logo_change_requests_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
