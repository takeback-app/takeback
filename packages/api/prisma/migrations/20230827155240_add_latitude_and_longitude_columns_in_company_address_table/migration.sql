/*
  Warnings:

  - Made the column `unit` on table `store_products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "companies_address" ADD COLUMN     "latitude" VARCHAR,
ADD COLUMN     "longitude" VARCHAR;

-- AlterTable
ALTER TABLE "store_products" ALTER COLUMN "unit" SET NOT NULL;
