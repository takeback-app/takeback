-- CreateTable
CREATE TABLE "integration_settings" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "folderPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integration_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "integration_settings_companyId_key" ON "integration_settings"("companyId");

-- AddForeignKey
ALTER TABLE "integration_settings" ADD CONSTRAINT "integration_settings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
