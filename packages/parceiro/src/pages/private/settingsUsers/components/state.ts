import { create } from 'zustand'

export type FilterIsActive = 'ALL' | 'ACTIVATED'

export interface FormData {
  type: FilterIsActive
}

type State = {
  type: FilterIsActive
  setForm: (formData: FormData) => void
}

const initialState = {
  type: 'ACTIVATED' as FilterIsActive
}

export const useUserCompanyActivated = create<State>(set => ({
  ...initialState,
  setForm: ({ type }: FormData) => set({ type })
}))
