-- CreateEnum
CREATE TYPE "PixTransactionStatus" AS ENUM ('WAITING', 'PAID', 'CANCELED', 'EXPIRED');

-- CreateTable
CREATE TABLE "pix_transactions" (
    "id" BIGSERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "txId" TEXT NOT NULL,
    "locId" INTEGER NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "status" "PixTransactionStatus" NOT NULL DEFAULT 'WAITING',
    "copiaCola" TEXT NOT NULL,
    "qrCodeImage" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pix_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "consumerId" UUID NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "pixTransactionId" BIGINT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "efi_webhook_events" (
    "id" BIGSERIAL NOT NULL,
    "event" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "efi_webhook_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_pixTransactionId_fkey" FOREIGN KEY ("pixTransactionId") REFERENCES "pix_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
