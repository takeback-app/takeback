/*
  Warnings:

  - You are about to drop the `representative` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `representative_billing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `representative_billing_company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `representative_refresh_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RepresentativeUserRole" AS ENUM ('ADMIN', 'CONSULTANT');

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "FK_bc70297a96701f77de9ef2cc796";

-- DropForeignKey
ALTER TABLE "representative_billing" DROP CONSTRAINT "FK_bb17f4d4ec99f0ecf21fd30b43d";

-- DropForeignKey
ALTER TABLE "representative_billing_company" DROP CONSTRAINT "FK_01c37a913fa1c0e5e37f937dffc";

-- DropForeignKey
ALTER TABLE "representative_billing_company" DROP CONSTRAINT "FK_bdcb7841105f7a02d0dfcef5d68";

-- DropForeignKey
ALTER TABLE "representative_refresh_tokens" DROP CONSTRAINT "FK_92dd2fbe754c9c44972a73357af";

-- DropTable
DROP TABLE "representative";

-- DropTable
DROP TABLE "representative_billing";

-- DropTable
DROP TABLE "representative_billing_company";

-- DropTable
DROP TABLE "representative_refresh_tokens";

-- CreateTable
CREATE TABLE "representatives" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fantasyName" VARCHAR NOT NULL,
    "cnpj" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "email" VARCHAR,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "balance" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "commissionPercentage" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "consultantBonusPercentage" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_2abe568eacaba9eba605bb231bc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "representative_users" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "cpf" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "email" VARCHAR,
    "phone" VARCHAR,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" "RepresentativeUserRole" NOT NULL DEFAULT 'CONSULTANT',
    "birthDay" INTEGER,
    "birthMonth" INTEGER,
    "birthYear" INTEGER,
    "representativeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "representative_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "representative_users_cpf_key" ON "representative_users"("cpf");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "FK_bc70297a96701f77de9ef2cc796" FOREIGN KEY ("representativeId") REFERENCES "representatives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "representative_users" ADD CONSTRAINT "representative_users_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "representatives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
