import { create } from 'zustand'

interface WithdrawalState {
  orderId: string | null
  code: string | null
  setOrder: (value: string) => void
  setCode: (value: string) => void
  reset: () => void
}

const initialState = {
  orderId: null,
  code: null
}

export const useWithdrawal = create<WithdrawalState>(set => ({
  ...initialState,
  setOrder: value => set({ orderId: value }),
  setCode: value => set({ code: value }),
  reset: () => set(initialState)
}))
