import { create } from 'zustand'

export type Order = 'asc' | 'desc'

export interface FormData {
  stateId?: number
  cityId?: number
  companyId?: string
}

interface State extends FormData {
  setForm: (formData: FormData) => void
  reset: () => void
}

const initialState = {
  stateId: undefined,
  cityId: undefined,
  companyId: undefined
}

export const useConsumerProfileReport = create<State>(set => ({
  ...initialState,
  setForm: (form: FormData) => set(form),
  reset: () => set(initialState)
}))
