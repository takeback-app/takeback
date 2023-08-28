import moment from 'moment'
import { create } from 'zustand'

export type Order = 'asc' | 'desc'

export enum OrderByColumn {
  TAKEBACK_FEE_VALUE = 'takebackFeeAmount',
  MONTHLY_PAYMENT = 'monthlyPayment',
  CITY_NAME = 'city.name'
}

export interface FormData {
  dateStart: string
  dateEnd: string
  orderBy: string
  order: Order
  monthlyPayment?: string
  transactionStatusId?: number
}

interface State extends FormData {
  setForm: (formData: FormData) => void
  reset: () => void
}

const initialState = {
  dateStart: moment().subtract(1, 'month').format('YYYY-MM-DD'),
  dateEnd: moment().format('YYYY-MM-DD'),
  orderBy: OrderByColumn.CITY_NAME,
  order: 'desc' as Order,
  transactionStatusId: undefined,
  monthlyPayment: ''
}

export const useFinancialReport = create<State>(set => ({
  ...initialState,
  setForm: (form: FormData) => set(form),
  reset: () => set(initialState)
}))
