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
  transactionStatusId?: number
}

export enum TransactionStatusTypes {
  PENDING = 1,
  APPROVED = 2,
  PAID_WITH_TAKEBACK = 3,
  WAITING = 4,
  CANCELED_BY_PARTNER = 5,
  CANCELED_BY_CUSTOMER = 6,
  PROCESSING = 7,
  OVERDUE = 8,
  NOT_PAID_BY_PARTNER = 9,
  TAKEBACK_BONUS = 10
}

interface State extends FormData {
  setForm: (formData: FormData) => void
  reset: () => void
}

const initialState = {
  dateStart: moment().subtract(1, 'month').format('YYYY-MM-DD'),
  dateEnd: moment().format('YYYY-MM-DD'),
  orderBy: 'totalAmount',
  order: 'desc' as Order,
  stateId: undefined,
  cityId: undefined,
  companyStatusId: undefined,
  transactionStatusId: TransactionStatusTypes.APPROVED
}

export const useCompanyReport = create<State>(set => ({
  ...initialState,
  setForm: (form: FormData) => set(form),
  reset: () => set(initialState)
}))
