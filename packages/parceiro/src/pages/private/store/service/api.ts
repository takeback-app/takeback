import { StoreOrderResponse } from './../StoreOrders'
import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

interface WithdrawlProductPayload {
  validationCode: string
  companyUserPassword: string
}

type ReturnApi = [
  boolean,
  { message?: string; storeOrder?: StoreOrderResponse }
]

export async function withdrawlProduct(
  id: string,
  data: WithdrawlProductPayload
): Promise<ReturnApi> {
  try {
    await API.put(`company/store/orders/withdraw/${id}`, data)

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function getStoreProduct(
  validationCode: string
): Promise<ReturnApi> {
  try {
    const { data } = await API.get(
      `company/store/orders/data/${validationCode}`
    )

    return [true, { storeOrder: data }]
  } catch (err) {
    const error = err as AxiosError
    console.log(error)
    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
