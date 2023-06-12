import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string }]

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
