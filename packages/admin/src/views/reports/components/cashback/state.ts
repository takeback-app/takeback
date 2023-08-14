import moment from 'moment'
import { create } from 'zustand'

export type Order = 'asc' | 'desc'

export interface FormData {
  dateStart: string
  dateEnd: string
  orderBy: string
  order: Order
  stateId?: number
  cityId?: number
  companyStatusId?: number
  companyId?: string
  companyUserId?: string
  transactionStatusId?: number
  paymentMethodId?: number
}

interface State extends FormData {
  setForm: (formData: FormData) => void
  reset: () => void
}

const initialState = {
  dateStart: moment().subtract(1, 'month').format('YYYY-MM-DD'),
  dateEnd: moment().format('YYYY-MM-DD'),
  orderBy: 'createdAt',
  order: 'desc' as Order,
  stateId: undefined,
  cityId: undefined,
  companyStatusId: undefined,
  companyId: undefined,
  companyUserId: undefined,
  transactionStatusId: undefined,
  paymentMethodId: undefined
}

export const useCashbackReport = create<State>(set => ({
  ...initialState,
  setForm: (form: FormData) => set(form),
  reset: () => set(initialState)
}))
