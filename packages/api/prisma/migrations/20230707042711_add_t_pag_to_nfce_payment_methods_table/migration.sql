/*
  Warnings:

  - You are about to drop the column `type` on the `nfce_payments` table. All the data in the column will be lost.
  - Added the required column `tPag` to the `nfce_payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nfce_payments" DROP COLUMN "type",
ADD COLUMN     "tPag" INTEGER NOT NULL;
