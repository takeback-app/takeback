import { AxiosError } from 'axios'
import { API } from '../../../../services/API'
import { FormData } from '../state'

type ReturnApi = [boolean, { message: string }]

export async function checkPassword(password: string): Promise<ReturnApi> {
  try {
    await API.post('/company/cashback/confirm-password', {
      password
    })

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    const message =
      error.response?.data.message || 'Erro interno. Contate um administrador'

    return [false, { message }]
  }
}

interface GenerateCashbackData extends FormData {
  code?: string
  companyUserPassword: string
}

export async function generateCashback(
  data: GenerateCashbackData
): Promise<ReturnApi> {
  try {
    await API.post('company/cashback/generate', data)

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}
