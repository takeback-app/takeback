import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string }]

interface TransferConfig {
  percentage: string
  maxDailyValue: number
}

export async function updateTransferConfig(
  data: TransferConfig
): Promise<ReturnApi> {
  try {
    const { data: response } = await API.put(`manager/transfer-config`, data)
    return [true, response]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
