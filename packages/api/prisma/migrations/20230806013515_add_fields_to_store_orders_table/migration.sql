/*
  Warnings:

  - Made the column `unit` on table `store_products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "store_orders" ADD COLUMN     "companyCreditValue" DECIMAL(10,2) NOT NULL DEFAULT 0;
