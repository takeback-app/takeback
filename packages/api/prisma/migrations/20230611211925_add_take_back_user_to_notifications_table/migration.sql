-- AlterTable
ALTER TABLE "notifications" ADD COLUMN "takeBackUserId" UUID;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_takeBackUserId_fkey" FOREIGN KEY ("takeBackUserId") REFERENCES "take_back_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
