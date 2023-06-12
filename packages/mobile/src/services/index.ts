/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios'
import { API } from './API'
import { CreateAccountFormData } from '../screens/public/createAccount/state'

type ReturnApi = [boolean, { [key: string]: any }]

export async function checkPassword(password: string): Promise<ReturnApi> {
  try {
    await API.post('costumer/authorize', {
      password
    })

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    const message =
      error.response?.data.message || 'Erro interno. Contate um administrador'

    return [false, { message }]
  }
}

export async function checkCpf(cpf: string): Promise<ReturnApi> {
  try {
    await API.get(`costumer/verify-if-exists/${cpf}`)

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    const message =
      error.response?.data.message || 'Erro interno. Contate um administrador'

    return [false, { message }]
  }
}

interface CreateSolicitationData {
  companyId: string
  companyPaymentMethodId: number
  value: number
}

export async function createCashbackSolicitation(
  data: CreateSolicitationData
): Promise<ReturnApi> {
  try {
    await API.post('costumer/solicitations/cashback', data)

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function createPaymentSolicitation(
  data: CreateSolicitationData
): Promise<ReturnApi> {
  try {
    await API.post('costumer/solicitations/payment', data)

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function generateDeliveryCode(id: string): Promise<ReturnApi> {
  try {
    const { data } = await API.post(
      `costumer/raffle-items/${id}/start-delivery`
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

export async function deactivateAccount(): Promise<ReturnApi> {
  try {
    const { data } = await API.post(`costumer/profile/deactivate`)

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function validateBalance(
  purchaseValue: number
): Promise<ReturnApi> {
  try {
    const { data } = await API.post(`costumer/balance/validate`, {
      purchaseValueInCents: Math.round(purchaseValue * 100)
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

export async function createAccount(
  form: CreateAccountFormData & { password: string }
): Promise<ReturnApi> {
  try {
    const { data } = await API.post('costumer/sign-up', {
      fullName: form.name,
      cpf: form.cpf,
      email: form.email,
      phone: form.phone,
      zipCode: form.zipCode,
      sex: form.sex,
      birthDate: form.birthday,
      password: form.password
    })

    return [true, data]
  } catch (err) {
    console.log(err)
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function updateAccount(
  form: Record<string, any>
): Promise<ReturnApi> {
  try {
    const { data } = await API.put('costumer/update-account', form)

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function validateCEP(cep: string): Promise<ReturnApi> {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

    if (!response.data?.cep) {
      return [false, { message: 'CEP inválido' }]
    }

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function saveNotificationToken(token?: string) {
  if (!token) return

  try {
    await API.post(`costumer/notification-token`, { token })
  } catch {}
}

interface GenerateCashbackData {
  totalAmount: number
  paymentMethodId: number
  companyId: string
}

export async function generateCashback(
  data: GenerateCashbackData
): Promise<ReturnApi> {
  try {
    await API.post('costumer/cashback', data)

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function createReferral(data: any): Promise<ReturnApi> {
  try {
    await API.post('costumer/referrals', data)

    return [true, { message: '' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
