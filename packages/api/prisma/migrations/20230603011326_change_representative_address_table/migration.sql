/*
  Warnings:

  - You are about to drop the column `representativeId` on the `representative_addresses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[representativeAddressId]` on the table `representatives` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `representativeAddressId` to the `representatives` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "representative_addresses" DROP CONSTRAINT "representative_addresses_representativeId_fkey";

-- AlterTable
ALTER TABLE "representative_addresses" DROP COLUMN "representativeId";

-- AlterTable
ALTER TABLE "representatives" ADD COLUMN     "representativeAddressId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "representatives_representativeAddressId_key" ON "representatives"("representativeAddressId");

-- AddForeignKey
ALTER TABLE "representatives" ADD CONSTRAINT "representatives_representativeAddressId_fkey" FOREIGN KEY ("representativeAddressId") REFERENCES "representative_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
