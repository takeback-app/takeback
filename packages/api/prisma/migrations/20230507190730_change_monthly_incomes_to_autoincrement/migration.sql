/*
  Warnings:

  - The `monthlyIncomeId` column on the `consumers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `monthly_incomes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `monthly_incomes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "consumers" DROP CONSTRAINT "consumers_monthlyIncomeId_fkey";

-- AlterTable
ALTER TABLE "consumers" DROP COLUMN "monthlyIncomeId",
ADD COLUMN     "monthlyIncomeId" INTEGER;

-- AlterTable
ALTER TABLE "monthly_incomes" DROP CONSTRAINT "monthly_incomes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "monthly_incomes_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "consumers" ADD CONSTRAINT "consumers_monthlyIncomeId_fkey" FOREIGN KEY ("monthlyIncomeId") REFERENCES "monthly_incomes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
