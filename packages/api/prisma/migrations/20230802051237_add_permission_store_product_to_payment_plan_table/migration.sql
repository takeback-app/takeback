/*
  Warnings:

  - Made the column `unit` on table `store_products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "payment_plans" ADD COLUMN     "canHaveStoreProducts" BOOLEAN NOT NULL DEFAULT false;
