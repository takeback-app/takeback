/*
  Warnings:

  - You are about to alter the column `value` on the `nfce_payments` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,4)`.

*/
-- AlterTable
ALTER TABLE "nfce_payments" ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "value" SET DEFAULT 0,
ALTER COLUMN "value" SET DATA TYPE DECIMAL(10,4);
