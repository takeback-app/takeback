import { create } from 'zustand'

export interface FormData {
  cpf: string
  totalAmount: number
  backAmount: number
  paymentMethods: {
    id: number
    value: number
    description: string
  }[]
}

type State = {
  consumerName: string
  requiresUserCode: boolean
  formData: FormData
  setFormData: (formData: FormData) => void
  setConsumerName: (consumerName: string) => void
  setRequiresUserCode: (requiresUserCode: boolean) => void
  resetState: () => void
}

const initialState = {
  consumerName: '',
  requiresUserCode: false,
  formData: {} as FormData
}

export const useCashRegisterState = create<State>(set => ({
  ...initialState,
  setConsumerName: (consumerName: string) => set({ consumerName }),
  setFormData: (formData: FormData) => set({ formData }),
  setRequiresUserCode: (requiresUserCode: boolean) => set({ requiresUserCode }),
  resetState: () => set(initialState)
}))
