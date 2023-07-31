import { create } from 'zustand'

interface BuyProductState {
  productId: string | null
  code: string | null
  quantity: number | null
  setQuantity: (value: number) => void
  setProduct: (value: string) => void
  setCode: (value: string) => void
  reset: () => void
}

const initialState = {
  productId: null,
  code: null,
  quantity: null
}

export const useBuyProduct = create<BuyProductState>(set => ({
  ...initialState,
  setProduct: value => set({ productId: value }),
  setCode: value => set({ code: value }),
  setQuantity: value => set({ quantity: value }),
  reset: () => set(initialState)
}))
