-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED');

-- CreateEnum
CREATE TYPE "Schooling" AS ENUM ('GRADUATED', 'COMPLETE_HIGH_SCHOOL', 'COMPLETE_PRIMARY_EDUCATION', 'ILLITERATE');

-- AlterTable
ALTER TABLE "consumers" ADD COLUMN     "hasChildren" BOOLEAN DEFAULT false,
ADD COLUMN     "maritalStatus" "MaritalStatus",
ADD COLUMN     "monthlyIncomeId" UUID,
ADD COLUMN     "schooling" "Schooling",
ADD COLUMN     "sex" "Sex";

-- CreateTable
CREATE TABLE "monthly_incomes" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "monthly_incomes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "consumers" ADD CONSTRAINT "consumers_monthlyIncomeId_fkey" FOREIGN KEY ("monthlyIncomeId") REFERENCES "monthly_incomes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
