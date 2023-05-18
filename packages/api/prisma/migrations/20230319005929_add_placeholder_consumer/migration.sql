/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `consumers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "consumers" ADD COLUMN     "isPlaceholderConsumer" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "consumers_cpf_key" ON "consumers"("cpf");
