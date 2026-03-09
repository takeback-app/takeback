import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string }]

export async function updateReferralBonusPercentage(
  data: any
): Promise<ReturnApi> {
  try {
    const { data: response } = await API.put(
      `manager/referral-percentage`,
      data
    )

    return [true, response]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
