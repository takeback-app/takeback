import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string }]

export interface AuctionSettings {
  isEnabled: boolean
  defaultDurationHours: number
  listingFee: number
  minimumStartingBid: number
  defaultMinimumIncrement: number
}

export async function updateAuctionSettings(
  data: AuctionSettings
): Promise<ReturnApi> {
  try {
    const { data: response } = await API.put(`manager/auction-settings`, data)
    return [true, response]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
