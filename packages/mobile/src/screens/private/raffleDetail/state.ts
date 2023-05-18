import { create } from 'zustand'

interface DeliveryState {
  selectedRaffleItemId?: string
  code?: string
  setRaffleItem: (value: string) => void
  setCode: (value: string) => void
}

export const useDeliveryStore = create<DeliveryState>(set => ({
  setRaffleItem: value => set({ selectedRaffleItemId: value }),
  setCode: value => set({ code: value })
}))
