-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'FINISHED_WITH_WINNER', 'FINISHED_WITHOUT_BIDS', 'NEGOTIATING', 'DELIVERED', 'CANCELED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "auction_settings" (
    "id" SERIAL NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "defaultDurationHours" INTEGER NOT NULL DEFAULT 48,
    "listingFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "minimumStartingBid" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "defaultMinimumIncrement" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auctions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "sellerId" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT NOT NULL,
    "attentionPoints" TEXT,
    "startingBid" DECIMAL(10,2) NOT NULL,
    "minimumIncrement" DECIMAL(10,2) NOT NULL,
    "highestBid" DECIMAL(10,2),
    "bidsCount" INTEGER NOT NULL DEFAULT 0,
    "status" "AuctionStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_images" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "auctionId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auctions_status_endsAt_idx" ON "auctions"("status", "endsAt");

-- CreateIndex
CREATE INDEX "auctions_sellerId_idx" ON "auctions"("sellerId");

-- CreateIndex
CREATE INDEX "auction_images_auctionId_order_idx" ON "auction_images"("auctionId", "order");

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_images" ADD CONSTRAINT "auction_images_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed
INSERT INTO "auction_settings" ("isEnabled", "defaultDurationHours", "listingFee", "minimumStartingBid", "defaultMinimumIncrement") VALUES (false, 48, 0, 1, 1);
