/*
  Warnings:

  - Added the required column `validationCode` to the `store_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store_orders" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "validationCode" TEXT NOT NULL,
ADD COLUMN     "withdrawalAt" TIMESTAMP(3);
