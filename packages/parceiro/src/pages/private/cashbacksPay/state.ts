import { create } from 'zustand'

export type FilterType = 'ALL' | 'VALIDATED' | 'IN_PROGRESS' | 'NOT_FOUND'

export interface FormData {
  type: FilterType
}

type State = {
  type: FilterType
  setForm: (formData: FormData) => void
}

const initialState = {
  type: 'ALL' as FilterType
}

export const useCashbackPay = create<State>(set => ({
  ...initialState,
  setForm: ({ type }: FormData) => set({ type })
}))
