import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string }]

export async function storeRepresentative(data: any): Promise<ReturnApi> {
  try {
    const { data: response } = await API.post(`manager/representatives`, data)

    return [true, response]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}

export async function activateRepresentative(id: string): Promise<ReturnApi> {
  try {
    const { data: response } = await API.post(
      `manager/representatives/${id}/activate`
    )

    return [true, response]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}

export async function deactivateRepresentative(id: string): Promise<ReturnApi> {
  try {
    const { data: response } = await API.post(
      `manager/representatives/${id}/deactivate`
    )

    return [true, response]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}

export async function updateRepresentative(
  id: string,
  data: any
): Promise<ReturnApi> {
  try {
    const { data: response } = await API.put(
      `manager/representatives/${id}`,
      data
    )

    return [true, response]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}
