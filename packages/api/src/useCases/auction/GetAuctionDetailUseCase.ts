import { AuctionStatus } from '@prisma/client'
import { ensureAuctionsEnabled } from './GetAuctionSettingsUseCase'
import { prisma } from '../../prisma'
import { InternalError } from '../../config/GenerateErros'

export const publicAuctionStatuses: AuctionStatus[] = [
  AuctionStatus.ACTIVE,
  AuctionStatus.FINISHED_WITH_WINNER,
  AuctionStatus.FINISHED_WITHOUT_BIDS,
  AuctionStatus.NEGOTIATING,
  AuctionStatus.DELIVERED,
]

interface GetAuctionDetailInput {
  id: string
  now?: Date
}

export interface AuctionDetail {
  id: string
  title: string
  description: string
  attentionPoints: string | null
  imageUrls: string[]
  startingBid: number
  minimumIncrement: number
  highestBid: number | null
  currentBid: number
  nextMinimumBid: number
  bidsCount: number
  publishedAt: Date
  endsAt: Date
  isFinished: boolean
}

export class GetAuctionDetailUseCase {
  async execute({
    id,
    now = new Date(),
  }: GetAuctionDetailInput): Promise<AuctionDetail> {
    await ensureAuctionsEnabled()

    const auction = await prisma.auction.findFirst({
      where: { id, status: { in: publicAuctionStatuses } },
      select: {
        id: true,
        title: true,
        description: true,
        attentionPoints: true,
        startingBid: true,
        minimumIncrement: true,
        highestBid: true,
        bidsCount: true,
        status: true,
        publishedAt: true,
        endsAt: true,
        images: { select: { url: true }, orderBy: { order: 'asc' } },
      },
    })

    if (!auction) {
      throw new InternalError('Anúncio não encontrado', 404)
    }

    const startingBid = Number(auction.startingBid)
    const minimumIncrement = Number(auction.minimumIncrement)
    const highestBid =
      auction.highestBid === null ? null : Number(auction.highestBid)

    return {
      id: auction.id,
      title: auction.title,
      description: auction.description,
      attentionPoints: auction.attentionPoints,
      imageUrls: auction.images.map((image) => image.url),
      startingBid,
      minimumIncrement,
      highestBid,
      currentBid: highestBid ?? startingBid,
      nextMinimumBid:
        highestBid === null
          ? startingBid
          : Math.round((highestBid + minimumIncrement) * 100) / 100,
      bidsCount: auction.bidsCount,
      publishedAt: auction.publishedAt,
      endsAt: auction.endsAt,
      isFinished:
        auction.status !== AuctionStatus.ACTIVE ||
        auction.endsAt.getTime() <= now.getTime(),
    }
  }
}
