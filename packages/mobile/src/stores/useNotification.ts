import { create } from 'zustand'

type CompaniesState = {
  token?: string
  setToken: (token?: string) => void
}

export const useNotification = create<CompaniesState>(set => ({
  token: undefined,
  setToken: token => set({ token })
}))
