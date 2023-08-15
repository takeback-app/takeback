import moment from 'moment'
import { create } from 'zustand'

export type Order = 'asc' | 'desc'

export interface FormData {
  dateStart: string
  dateEnd: string
  orderBy: string
  order: Order
  officeJob?: number
  statusTransaction?: number
  companyId?: string
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
  orderBy: 'sellerName',
  order: 'asc' as Order,
  statusTransaction: undefined,
  officeJob: undefined,
  stateId: undefined,
  cityId: undefined,
  companyId: undefined
}

export const useSellerReport = create<State>(set => ({
  ...initialState,
  setForm: (form: FormData) => set(form),
  reset: () => set(initialState)
}))
