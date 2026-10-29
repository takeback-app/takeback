import { AuctionStatus, Prisma } from '@prisma/client'
import { ensureAuctionsEnabled } from './GetAuctionSettingsUseCase'
import { isAuctionImageUrl } from './AuctionImages'
import { prisma } from '../../prisma'
import { InternalError } from '../../config/GenerateErros'

export const MAX_DRAFTS_PER_SELLER = 10

export interface AuctionDraftData {
  title: string
  description: string
  attentionPoints?: string | null
  startingBid: number
  minimumIncrement?: number
  imageUrls: string[]
}

const ownAuctionSelect = {
  id: true,
  title: true,
  description: true,
  attentionPoints: true,
  startingBid: true,
  minimumIncrement: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  images: { select: { url: true }, orderBy: { order: 'asc' } },
} satisfies Prisma.AuctionSelect

type OwnAuctionRow = Prisma.AuctionGetPayload<{
  select: typeof ownAuctionSelect
}>

function serializeOwnAuction(auction: OwnAuctionRow) {
  return {
    id: auction.id,
    title: auction.title,
    description: auction.description,
    attentionPoints: auction.attentionPoints,
    startingBid: Number(auction.startingBid),
    minimumIncrement: Number(auction.minimumIncrement),
    imageUrls: auction.images.map((image) => image.url),
    status: auction.status,
    createdAt: auction.createdAt,
    updatedAt: auction.updatedAt,
  }
}

function formatMoney(value: number) {
  return value
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    .replace(/\s/g, ' ')
}

function notFound() {
  return new InternalError('Anúncio não encontrado', 404)
}

export class SaveAuctionDraftUseCase {
  async execute(sellerId: string, data: AuctionDraftData, auctionId?: string) {
    const settings = await ensureAuctionsEnabled()

    const minimumStartingBid = Number(settings.minimumStartingBid)
    const defaultMinimumIncrement = Number(settings.defaultMinimumIncrement)
    const minimumIncrement = data.minimumIncrement ?? defaultMinimumIncrement

    if (data.startingBid < minimumStartingBid) {
      throw new InternalError(
        `O lance inicial deve ser de pelo menos ${formatMoney(
          minimumStartingBid,
        )}`,
        400,
      )
    }

    if (minimumIncrement < defaultMinimumIncrement) {
      throw new InternalError(
        `O incremento mínimo deve ser de pelo menos ${formatMoney(
          defaultMinimumIncrement,
        )}`,
        400,
      )
    }

    const imageUrls = [...new Set(data.imageUrls)]

    if (!imageUrls.every(isAuctionImageUrl)) {
      throw new InternalError(
        'Envie as fotos pelo aplicativo antes de salvar',
        400,
      )
    }

    const fields = {
      title: data.title,
      description: data.description,
      attentionPoints: data.attentionPoints || null,
      startingBid: data.startingBid.toFixed(2),
      minimumIncrement: minimumIncrement.toFixed(2),
    }
    const images = imageUrls.map((url, order) => ({ url, order }))

    if (!auctionId) {
      const drafts = await prisma.auction.count({
        where: { sellerId, status: AuctionStatus.DRAFT },
      })

      if (drafts >= MAX_DRAFTS_PER_SELLER) {
        throw new InternalError(
          `Você pode ter no máximo ${MAX_DRAFTS_PER_SELLER} rascunhos`,
          400,
        )
      }

      const created = await prisma.auction.create({
        data: { ...fields, sellerId, images: { create: images } },
        select: ownAuctionSelect,
      })

      return serializeOwnAuction(created)
    }

    const updated = await prisma.$transaction(async (tx) => {
      const { count } = await tx.auction.updateMany({
        where: { id: auctionId, sellerId, status: AuctionStatus.DRAFT },
        data: fields,
      })

      if (!count) throw notFound()

      await tx.auctionImage.deleteMany({ where: { auctionId } })
      await tx.auctionImage.createMany({
        data: images.map((image) => ({ ...image, auctionId })),
      })

      return tx.auction.findUnique({
        where: { id: auctionId },
        select: ownAuctionSelect,
      })
    })

    return serializeOwnAuction(updated)
  }
}

export class GetOwnAuctionUseCase {
  async execute(sellerId: string, auctionId: string) {
    await ensureAuctionsEnabled()

    const auction = await prisma.auction.findFirst({
      where: { id: auctionId, sellerId },
      select: ownAuctionSelect,
    })

    if (!auction) throw notFound()

    return serializeOwnAuction(auction)
  }
}

export class ListOwnAuctionsUseCase {
  async execute(sellerId: string, status?: AuctionStatus) {
    await ensureAuctionsEnabled()

    const auctions = await prisma.auction.findMany({
      where: { sellerId, status },
      orderBy: { updatedAt: 'desc' },
      select: ownAuctionSelect,
    })

    return auctions.map(serializeOwnAuction)
  }
}

export class DeleteAuctionDraftUseCase {
  async execute(sellerId: string, auctionId: string) {
    await ensureAuctionsEnabled()

    const { count } = await prisma.auction.deleteMany({
      where: { id: auctionId, sellerId, status: AuctionStatus.DRAFT },
    })

    if (!count) throw notFound()
  }
}
