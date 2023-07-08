-- CreateTable
CREATE TABLE "access_tokens" (
    "id" UUID NOT NULL,
    "token" TEXT,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "access_tokens" ADD CONSTRAINT "access_tokens_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
