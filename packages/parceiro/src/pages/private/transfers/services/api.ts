import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string }]

interface TransferPayload {
  companyReceivedId: string
  value: number
  password: string
}

export async function createTransfer(
  data: TransferPayload
): Promise<ReturnApi> {
  try {
    const { data: response } = await API.post(`company/transfer/balance`, data)
    return [true, response]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
