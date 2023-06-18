-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'NEW_COMPANY';

-- RenameIndex
ALTER INDEX "referrals_cpf_key" RENAME TO "referrals_identifier_key";
