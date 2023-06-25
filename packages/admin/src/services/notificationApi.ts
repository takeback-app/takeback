import { AxiosError } from 'axios'
import { API } from './API'

type ReturnApi = [boolean, { message?: string }]

interface updateForm {
  isRead: boolean
}

export async function updateNotification(
  id: string,
  data: updateForm
): Promise<ReturnApi> {
  try {
    await API.put(`manager/notifications/${id}`, data)

    return [true, { message: 'Notificação atualizada' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
