/*
  Warnings:

  - You are about to drop the column `isOpenToOtherEmployee` on the `raffles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "raffles" DROP COLUMN "isOpenToOtherEmployee",
ADD COLUMN     "isOpenToEmployees" BOOLEAN NOT NULL DEFAULT false;
