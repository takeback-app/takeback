import moment from 'moment'
import { create } from 'zustand'

export type Order = 'asc' | 'desc'

export interface FormData {
  dateStart: string
  dateEnd: string
  orderBy: FindDepositsOrderByColumn
  order: Order
  isPaid?: string
}

export enum FindDepositsOrderByColumn {
  FULL_NAME = 'fullname',
  VALUE = 'value',
  CREATED_AT = 'createdAt'
}

interface State extends FormData {
  setForm: (formData: FormData) => void
  reset: () => void
}

const initialState = {
  dateStart: moment().subtract(1, 'month').format('YYYY-MM-DD'),
  dateEnd: moment().format('YYYY-MM-DD'),
  orderBy: FindDepositsOrderByColumn.CREATED_AT,
  order: 'desc' as Order,
  isPaid: undefined
}

export const useTransfer = create<State>(set => ({
  ...initialState,
  setForm: (form: FormData) => set(form),
  reset: () => set(initialState)
}))
