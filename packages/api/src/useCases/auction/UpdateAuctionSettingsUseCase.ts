import {
  AuctionSettingsResponse,
  findOrCreateAuctionSettings,
  serializeAuctionSettings,
} from './GetAuctionSettingsUseCase'
import { prisma } from '../../prisma'

export class UpdateAuctionSettingsUseCase {
  async execute(data: AuctionSettingsResponse) {
    const { id } = await findOrCreateAuctionSettings()

    const settings = await prisma.auctionSetting.update({
      where: { id },
      data: {
        isEnabled: data.isEnabled,
        defaultDurationHours: data.defaultDurationHours,
        listingFee: data.listingFee.toFixed(2),
        minimumStartingBid: data.minimumStartingBid.toFixed(2),
        defaultMinimumIncrement: data.defaultMinimumIncrement.toFixed(2),
      },
    })

    return serializeAuctionSettings(settings)
  }
}
