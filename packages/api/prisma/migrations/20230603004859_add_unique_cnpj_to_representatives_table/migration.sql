/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `representatives` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "representatives_cnpj_key" ON "representatives"("cnpj");
