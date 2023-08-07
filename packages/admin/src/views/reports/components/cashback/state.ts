import moment from 'moment'
import { create } from 'zustand'

export type Order = 'asc' | 'desc'

export interface FormData {
  firstDate: string
  secondDate: string
  orderBy: string
  order: Order
  paymentMethod?: number
  statusTransaction?: number
}

type State = {
  firstDate: string
  secondDate: string
  orderBy: string
  order: Order
  paymentMethod?: number
  statusTransaction?: number
  setForm: (formData: FormData) => void
  reset: () => void
}

const initialState = {
  firstDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
  secondDate: moment().format('YYYY-MM-DD'),
  orderBy: 'totalAmount',
  order: 'asc' as Order,
  statusTransaction: undefined,
  paymentMethod: undefined
}

export const useCashbackReport = create<State>(set => ({
  ...initialState,
  setForm: (form: FormData) => set(form),
  reset: () => set(initialState)
}))
