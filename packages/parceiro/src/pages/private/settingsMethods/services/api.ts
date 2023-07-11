import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message: string }]

export async function createCompanyPaymentMethod(data: {
  cashbackPercentage: number
  paymentMethodId: number
}): Promise<ReturnApi> {
  try {
    const response = await API.post(`company/company-payment-methods`, data)

    return [true, response.data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function editCompanyPaymentMethod(
  id: number,
  data: { cashbackPercentage: number; isActive: string }
): Promise<ReturnApi> {
  try {
    const response = await API.put(
      `company/company-payment-methods/${id}`,
      data
    )

    return [true, response.data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function deleteCompanyPaymentMethod(
  id: number
): Promise<ReturnApi> {
  try {
    const response = await API.delete(
      `company/company-payment-methods/${id}/delete`
    )

    return [true, response.data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
