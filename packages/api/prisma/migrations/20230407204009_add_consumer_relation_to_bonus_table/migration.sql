-- AddForeignKey
ALTER TABLE "bonus" ADD CONSTRAINT "bonus_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
