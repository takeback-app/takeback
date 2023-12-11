import moment from 'moment'
import { create } from 'zustand'

export type Order = 'asc' | 'desc'

export interface FormData {
  statusId?: number
  paymentMethodId?: number
  companyId?: string
  startDate: string
  endDate: string
}

interface State extends FormData {
  setForm: (formData: FormData) => void
  reset: () => void
}

const initialState = {
  statusId: undefined,
  paymentMethodId: undefined,
  companyId: undefined,
  startDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD')
}

export const usePaymentOrders = create<State>(set => ({
  ...initialState,
  setForm: (form: FormData) => set(form),
  reset: () => set(initialState)
}))
