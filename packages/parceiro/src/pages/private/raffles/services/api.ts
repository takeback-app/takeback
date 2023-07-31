/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string; [key: string]: any }]

export async function cancelRaffle(id: string): Promise<ReturnApi> {
  try {
    const { data } = await API.post(`company/raffles/${id}/cancel`)

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function drawRaffle(id: string): Promise<ReturnApi> {
  try {
    const { data } = await API.post(`company/raffles/${id}/draw`)

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

interface Item {
  description: string
  order: number
  imageUrl: string
}

export interface RaffleFormData {
  drawDate: string
  imageUrl: string
  isOpenToOtherCompanies: boolean
  isOpenToEmployees: boolean
  items: Item[]
  ticketValue: number
  pickUpLocation: string
  title: string
}

export async function storeRaffle(data: RaffleFormData): Promise<ReturnApi> {
  try {
    await API.post(`company/raffles`, data)

    return [true, { message: 'Sorteio criado com sucesso' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function confirmDelivery(
  id: string,
  data: { userCode: string }
): Promise<ReturnApi> {
  try {
    await API.post(`company/raffle-items/${id}/delivery`, data)

    return [true, { message: 'Entrega confirmada!' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function confirmWithdrawal(
  id: string,
  data: { code: string }
): Promise<ReturnApi> {
  try {
    await API.put(`company/store/orders/${id}`, data)

    return [true, { message: 'Entrega confirmada!' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function updateRaffle(
  id: string,
  data: Partial<RaffleFormData>
): Promise<ReturnApi> {
  try {
    await API.put(`company/raffles/${id}`, data)

    return [true, { message: 'Sorteio atualizado com sucesso' }]
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
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
