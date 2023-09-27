/*
  Warnings:

  - Made the column `sellId` on table `cmm_sells` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "IntegrationType" ADD VALUE 'CMM';

-- AlterTable
ALTER TABLE "cmm_sells" ALTER COLUMN "sellId" SET NOT NULL;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "integrationType" "IntegrationType";
