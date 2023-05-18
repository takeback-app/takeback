/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `company_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "company_users_cpf_key" ON "company_users"("cpf");
