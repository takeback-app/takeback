import { AxiosError } from 'axios'
import { API } from './API'

type ReturnApi = [boolean, { message?: string }]

interface IntegrationData {
  url?: string
  folderPath?: string
}

export async function updateIntegration(
  companyId: string,
  integrationData: IntegrationData
): Promise<ReturnApi> {
  try {
    const { data } = await API.put(
      `manager/companies/${companyId}/integration`,
      integrationData
    )

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function deleteIntegration(
  integrationId: string
): Promise<ReturnApi> {
  try {
    const { data } = await API.delete(`manager/integration/${integrationId}`)

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
