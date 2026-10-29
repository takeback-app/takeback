import { AuctionStatus } from '@prisma/client'
import { ensureAuctionsEnabled } from './GetAuctionSettingsUseCase'
import { prisma } from '../../prisma'

interface ListActiveAuctionsInput {
  page: number
  limit: number
  search?: string
  now?: Date
}

export interface AuctionListItem {
  id: string
  title: string
  imageUrl: string | null
  startingBid: number
  highestBid: number | null
  currentBid: number
  bidsCount: number
  endsAt: Date
}

export class ListActiveAuctionsUseCase {
  async execute({
    page,
    limit,
    search,
    now = new Date(),
  }: ListActiveAuctionsInput): Promise<AuctionListItem[]> {
    await ensureAuctionsEnabled()

    const auctions = await prisma.auction.findMany({
      where: {
        status: AuctionStatus.ACTIVE,
        endsAt: { gt: now },
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      orderBy: [{ endsAt: 'asc' }, { id: 'asc' }],
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        title: true,
        startingBid: true,
        highestBid: true,
        bidsCount: true,
        endsAt: true,
        images: { select: { url: true }, orderBy: { order: 'asc' }, take: 1 },
      },
    })

    return auctions.map((auction) => {
      const highestBid =
        auction.highestBid === null ? null : Number(auction.highestBid)

      return {
        id: auction.id,
        title: auction.title,
        imageUrl: auction.images[0]?.url ?? null,
        startingBid: Number(auction.startingBid),
        highestBid,
        currentBid: highestBid ?? Number(auction.startingBid),
        bidsCount: auction.bidsCount,
        endsAt: auction.endsAt,
      }
    })
  }
}
