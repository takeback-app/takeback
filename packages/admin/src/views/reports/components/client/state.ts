import moment from 'moment'
import { create } from 'zustand'

export type Order = 'asc' | 'desc'

export type HaveTransactions = 'true' | 'false'

export interface FormData {
  dateStart: string
  dateEnd: string
  orderBy: string
  order: Order
  haveTransactions: HaveTransactions
  stateId?: number
  cityId?: number
}

interface State extends FormData {
  setForm: (formData: FormData) => void
  reset: () => void
}

const initialState = {
  dateStart: moment().subtract(1, 'month').format('YYYY-MM-DD'),
  dateEnd: moment().format('YYYY-MM-DD'),
  orderBy: 'consumers.fullName',
  order: 'asc' as Order,
  haveTransactions: 'true' as HaveTransactions,
  stateId: undefined,
  cityId: undefined
}

export const useClientReport = create<State>(set => ({
  ...initialState,
  setForm: (form: FormData) => set(form),
  reset: () => set(initialState)
}))
