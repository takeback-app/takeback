import moment from 'moment'
import { create } from 'zustand'

export type FilterType = 'all' | 'pending' | 'approved'

export interface FormData {
  date: string
  type: FilterType
}

type State = {
  date: string
  type: FilterType
  setForm: (formData: FormData) => void
}

const initialState = {
  date: moment().format('YYYY-MM-DD'),
  type: 'all' as FilterType
}

export const useCashConference = create<State>(set => ({
  ...initialState,
  setForm: ({ date, type }: FormData) => set({ date, type })
}))
