/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string; [key: string]: any }]

export interface LogoChangeRequestFormData {
  logoUrl: string
}

export async function approveLogoRequest(id: string): Promise<ReturnApi> {
  try {
    await API.put(`manager/logo-change-requests/${id}/approve`)

    return [true, { message: 'Solicitação aprovada com sucesso' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}

export async function reproveLogoRequest(id: string): Promise<ReturnApi> {
  try {
    await API.put(`manager/logo-change-requests/${id}/reprove`)

    return [true, { message: 'Solicitação aprovada com sucesso' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}
