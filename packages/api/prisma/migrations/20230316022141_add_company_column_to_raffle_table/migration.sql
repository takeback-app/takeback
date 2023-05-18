/*
  Warnings:

  - Added the required column `companyId` to the `raffles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "raffles" ADD COLUMN     "companyId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
