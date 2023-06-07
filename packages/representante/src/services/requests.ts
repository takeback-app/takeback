import { AxiosError } from 'axios'
import { API } from './API'

type RequestResponse = [boolean, Record<string, string>]

export async function updateUserPassword(
  password: string,
  newPassword: string
): Promise<RequestResponse> {
  try {
    await API.put('representative/user/password', {
      password,
      newPassword
    })

    return [true, { message: 'Senha atualizada com sucesso!' }]
  } catch (err) {
    const error = err as AxiosError

    const message =
      error.response?.data.message || 'Erro interno. Contate um administrador'

    return [false, { message }]
  }
}
