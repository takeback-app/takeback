/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import { API } from '../../../../services/API'

type ReturnApi = [boolean, { message?: string; [key: string]: any }]

export async function deleteNotificationSolicitation(
  id: string
): Promise<ReturnApi> {
  try {
    const { data } = await API.delete(
      `company/notification-solicitations/${id}`
    )

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}

export interface AudienceFormData {
  audienceSex: 'MALE' | 'FEMALE' | 'ALL'
  storeVisitType: 'ALL' | 'NEVER' | 'FROM_THE_DATE_OF_PURCHASE'
  hasChildren?: boolean
  minAudienceAge?: number
  maxAudienceAge?: number
  audienceBalance?: number
  dateOfPurchase?: string
}

export async function getAudienceCount(
  form: AudienceFormData
): Promise<ReturnApi> {
  try {
    const { data } = await API.post(
      `company/notification-solicitations/audience`,
      form
    )

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}

export interface CreateNotificationSolicitationFormData
  extends AudienceFormData {
  title: string
  message: string
}

export async function createNotificationSolicitation(
  form: CreateNotificationSolicitationFormData
): Promise<ReturnApi> {
  try {
    const { data } = await API.post(`company/notification-solicitations`, form)

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Conte um administrador' }
    ]
  }
}
