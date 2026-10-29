import { AuctionStatus } from '@prisma/client'

export const auctionStatusTransitions: Record<AuctionStatus, AuctionStatus[]> =
  {
    DRAFT: [AuctionStatus.ACTIVE, AuctionStatus.CANCELED],
    ACTIVE: [
      AuctionStatus.FINISHED_WITH_WINNER,
      AuctionStatus.FINISHED_WITHOUT_BIDS,
      AuctionStatus.CANCELED,
      AuctionStatus.SUSPENDED,
    ],
    FINISHED_WITH_WINNER: [AuctionStatus.NEGOTIATING],
    FINISHED_WITHOUT_BIDS: [],
    NEGOTIATING: [AuctionStatus.DELIVERED, AuctionStatus.CANCELED],
    DELIVERED: [],
    CANCELED: [],
    SUSPENDED: [AuctionStatus.ACTIVE, AuctionStatus.CANCELED],
  }

export function canTransitionAuction(from: AuctionStatus, to: AuctionStatus) {
  return auctionStatusTransitions[from].includes(to)
}
