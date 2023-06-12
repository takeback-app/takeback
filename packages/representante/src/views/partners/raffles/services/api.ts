import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string }]

export interface RaffleFormData {
  statusId: number
}

export async function updateRaffle(
  id: string,
  data: RaffleFormData
): Promise<ReturnApi> {
  try {
    await API.put(`manager/raffles/${id}`, data)

    return [true, { message: 'Sorteio atualizado com sucesso' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
