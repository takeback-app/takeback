/*
  Warnings:

  - You are about to drop the column `valueInCents` on the `nfce_payments` table. All the data in the column will be lost.
  - Added the required column `value` to the `nfce_payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nfce_payments" RENAME COLUMN "valueInCents" TO "value";
