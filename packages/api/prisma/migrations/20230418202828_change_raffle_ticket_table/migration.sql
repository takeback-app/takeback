/*
  Warnings:

  - You are about to drop the column `isActive` on the `raffle_tickets` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RaffleTicketStatus" AS ENUM ('PENDING', 'ACTIVE', 'FINISHED', 'CANCELED');

-- AlterTable
ALTER TABLE "raffle_tickets" DROP COLUMN "isActive",
ADD COLUMN     "status" "RaffleTicketStatus" NOT NULL DEFAULT 'PENDING';
