import { AxiosError } from 'axios'

import { API } from './API'

type ReturnApi = [boolean, { message?: string }]

export async function updateCompany(id: string, data: any): Promise<ReturnApi> {
  try {
    await API.put(`representative/companies/${id}`, data)

    return [true, { message: 'Empresa atualizada com sucesso' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function storeCompany(data: any): Promise<ReturnApi> {
  try {
    await API.post(`representative/companies`, data)

    return [true, { message: 'Empresa atualizada com sucesso' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function resetRootUser(
  companyId: string,
  data: { userName: string; email: string }
): Promise<ReturnApi> {
  try {
    await API.post(
      `representative/companies/${companyId}/reset-root-user`,
      data
    )

    return [true, { message: 'Empresa atualizada com sucesso' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function updateCompanyConsultant(
  companyId: string,
  data: { consultantId: string }
): Promise<ReturnApi> {
  try {
    await API.put(`representative/companies/${companyId}/consultant`, data)

    return [true, { message: 'Empresa atualizada com sucesso' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
