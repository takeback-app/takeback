import { AxiosError } from 'axios'
import { API } from '../../../services/API'

type ReturnApi = [boolean, { message?: string; [key: string]: any }]

export async function storeProduct(data: any): Promise<ReturnApi> {
  try {
    const { data: response } = await API.post(`manager/store/products`, data)

    return [true, response]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function storeImage(file: File): Promise<ReturnApi> {
  const formData = new FormData()

  formData.append('file', file)

  try {
    const { data } = await API.post(`manager/file-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function deleteProduct(id: string): Promise<ReturnApi> {
  try {
    const { data } = await API.delete(`manager/store/products/${id}`)

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}
