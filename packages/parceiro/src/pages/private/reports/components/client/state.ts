import moment from 'moment'
import { create } from 'zustand'

export type Order = 'asc' | 'desc'

export interface FormData {
  firstDate: string
  secondDate: string
  orderBy: string
  order: Order
}

type State = {
  firstDate: string
  secondDate: string
  orderBy: string
  order: Order
  setForm: (formData: FormData) => void
  reset: () => void
}

const initialState = {
  firstDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
  secondDate: moment().format('YYYY-MM-DD'),
  orderBy: 'consumers.fullName',
  order: 'asc' as Order
}

export const useClientReport = create<State>(set => ({
  ...initialState,
  setForm: ({ firstDate, secondDate, orderBy, order }: FormData) =>
    set({ firstDate, secondDate, orderBy, order }),
  reset: () => set(initialState)
}))
