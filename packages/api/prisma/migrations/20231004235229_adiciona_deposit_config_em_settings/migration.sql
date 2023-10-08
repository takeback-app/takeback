-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "depositFeePercentage" DECIMAL(10,4) DEFAULT 0,
ADD COLUMN     "depositMaxDailyValue" DECIMAL(10,4) DEFAULT 0;
