-- CreateTable
CREATE TABLE "raffle_item_deliveries" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userCode" VARCHAR NOT NULL,
    "raffleItemId" UUID NOT NULL,
    "companyUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "raffle_item_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "raffle_item_deliveries_raffleItemId_key" ON "raffle_item_deliveries"("raffleItemId");

-- AddForeignKey
ALTER TABLE "raffle_item_deliveries" ADD CONSTRAINT "raffle_item_deliveries_raffleItemId_fkey" FOREIGN KEY ("raffleItemId") REFERENCES "raffle_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_item_deliveries" ADD CONSTRAINT "raffle_item_deliveries_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "company_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
