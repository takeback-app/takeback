-- CreateTable
CREATE TABLE "raffle_status" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "raffle_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raffles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(500) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "ticketValue" DECIMAL(10,2) NOT NULL,
    "drawDate" TIMESTAMP(3) NOT NULL,
    "isOpenToOtherCompanies" BOOLEAN NOT NULL DEFAULT false,
    "statusId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raffles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raffle_items" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "order" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "raffleId" UUID NOT NULL,
    "winnerTicketId" UUID,

    CONSTRAINT "raffle_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raffle_tickets" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "number" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "raffleId" UUID NOT NULL,
    "consumerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raffle_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "raffle_tickets_number_raffleId_key" ON "raffle_tickets"("number", "raffleId");

-- AddForeignKey
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "raffle_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_items" ADD CONSTRAINT "raffle_items_winnerTicketId_fkey" FOREIGN KEY ("winnerTicketId") REFERENCES "raffle_tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_items" ADD CONSTRAINT "raffle_items_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "raffles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_tickets" ADD CONSTRAINT "raffle_tickets_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_tickets" ADD CONSTRAINT "raffle_tickets_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "raffles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
