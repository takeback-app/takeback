/*
  Warnings:

  - You are about to drop the column `validatedByNfce` on the `transactions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NFCeValidationStatus" AS ENUM ('IN_PROGRESS', 'NOT_FOUND', 'VALIDATED');

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "validatedByNfce",
ADD COLUMN     "nfceValidationStatus" "NFCeValidationStatus" NOT NULL DEFAULT 'IN_PROGRESS';
