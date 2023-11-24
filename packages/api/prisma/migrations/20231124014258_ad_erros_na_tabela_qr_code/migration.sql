-- AlterTable
ALTER TABLE "qr_codes" ADD COLUMN     "errors" TEXT[] DEFAULT ARRAY[]::TEXT[];
