import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string; [key: string]: any }]

export async function updateCompanyRepresentative(
  id: string,
  data: any
): Promise<ReturnApi> {
  try {
    const { data: response } = await API.put(
      `manager/company/${id}/representative`,
      data
    )

    return [true, response]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function storeImage(
  file: File,
  query: Record<string, string> = {}
): Promise<ReturnApi> {
  const formData = new FormData()

  formData.append('file', file)

  try {
    const { data } = await API.post(`manager/file-upload`, formData, {
      params: query,
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

export async function updateCompanyLogo(
  id: string,
  logoUrl: string
): Promise<ReturnApi> {
  try {
    const { data: response } = await API.put(`manager/companies/${id}/logo`, {
      logoUrl
    })

    return [true, response]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
