import { AuctionSetting } from '@prisma/client'
import { prisma } from '../../prisma'
import { InternalError } from '../../config/GenerateErros'

export interface AuctionSettingsResponse {
  isEnabled: boolean
  defaultDurationHours: number
  listingFee: number
  minimumStartingBid: number
  defaultMinimumIncrement: number
}

export function serializeAuctionSettings(
  settings: AuctionSetting,
): AuctionSettingsResponse {
  return {
    isEnabled: settings.isEnabled,
    defaultDurationHours: settings.defaultDurationHours,
    listingFee: Number(settings.listingFee),
    minimumStartingBid: Number(settings.minimumStartingBid),
    defaultMinimumIncrement: Number(settings.defaultMinimumIncrement),
  }
}

export async function findOrCreateAuctionSettings() {
  const settings = await prisma.auctionSetting.findFirst({
    orderBy: { id: 'asc' },
  })

  return settings ?? prisma.auctionSetting.create({ data: {} })
}

export async function ensureAuctionsEnabled() {
  const settings = await findOrCreateAuctionSettings()

  if (!settings.isEnabled) {
    throw new InternalError('O Desapega não está disponível no momento', 403)
  }

  return settings
}

export class GetAuctionSettingsUseCase {
  async execute() {
    return serializeAuctionSettings(await findOrCreateAuctionSettings())
  }
}
