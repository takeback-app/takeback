/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string; [key: string]: any }]

export interface LogoChangeRequestFormData {
  logoUrl: string
}

export async function storeLogoChangeRequest(
  data: LogoChangeRequestFormData
): Promise<ReturnApi> {
  try {
    await API.post(`company/logo-change-requests`, data)

    return [true, { message: 'Solicitação enviada com sucesso' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}

export async function storeImage(file: File): Promise<ReturnApi> {
  const formData = new FormData()

  formData.append('file', file)

  try {
    const { data } = await API.post(`company/file-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}

export async function deleteLogoChangeRequest(id: string): Promise<ReturnApi> {
  try {
    const { data } = await API.delete(`company/logo-change-requests/${id}`)

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}
