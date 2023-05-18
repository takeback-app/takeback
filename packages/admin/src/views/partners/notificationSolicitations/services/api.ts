/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string; [key: string]: any }]

export async function approveNotificationSolicitation(
  id: string
): Promise<ReturnApi> {
  try {
    const { data } = await API.put(
      `manager/notification-solicitations/${id}/approve`
    )

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}

export async function reproveNotificationSolicitation(
  id: string
): Promise<ReturnApi> {
  try {
    const { data } = await API.put(
      `manager/notification-solicitations/${id}/reprove`
    )

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}
