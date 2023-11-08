import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string }]

interface TransferPayload {
  companySentId: string
  companyReceivedId: string
  value: number
}

export async function createTransfer(
  data: TransferPayload
): Promise<ReturnApi> {
  try {
    const { data: response } = await API.post(
      `manager/company/transfer/balance`,
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

export async function getCompanyBalance(
  companyId: string
): Promise<[boolean, string]> {
  try {
    const response = await API.get(`manager/company/balance/${companyId}`)
    return [true, response.data.positiveBalance]
  } catch (err) {
    const error = err as AxiosError
    return [false, error.message]
  }
}
