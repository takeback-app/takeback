-- AlterTable
ALTER TABLE "deposits" ADD COLUMN     "bankPixFeeValue" DECIMAL(10,4) DEFAULT 0,
ADD COLUMN     "depositFeeValue" DECIMAL(10,4) DEFAULT 0,
ALTER COLUMN "bankPixFeePercentage" SET DEFAULT 0,
ALTER COLUMN "depositFeePercentage" SET DEFAULT 0;
