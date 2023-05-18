import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

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

interface ApproveOrReproveData {
  solicitationsId: string[]
  cancellationDescription?: string
  companyUserPassword: string
}

export async function approveSolicitation(
  data: ApproveOrReproveData
): Promise<ReturnApi> {
  try {
    await API.put('company/solicitations/approve', data)

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}

export async function reproveSolicitation(
  data: ApproveOrReproveData
): Promise<ReturnApi> {
  try {
    await API.put('company/solicitations/reprove', data)

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}
