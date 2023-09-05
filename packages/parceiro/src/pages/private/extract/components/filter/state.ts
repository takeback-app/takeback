import { create } from 'zustand'

export interface FormData {
  month: string
  year: string
}

type State = {
  month: string
  year: string
  setForm: (formData: FormData) => void
  reset: () => void
}

const initialState = {
  month: String(new Date().getMonth()),
  year: String(new Date().getFullYear())
}

export const useExtractReport = create<State>(set => ({
  ...initialState,
  setForm: (form: FormData) => set(form),
  reset: () => set(initialState)
}))
