/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string; [key: string]: any }]

interface CreateBirthdayNotificationFormData {
  title: string
  message: string
}

export async function createBirthdayNotification(
  form: CreateBirthdayNotificationFormData
): Promise<ReturnApi> {
  try {
    const { data } = await API.post(`company/birthday-notifications`, form)

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
