import { create } from 'zustand'
import { Company } from './index'

interface PaymentState {
  totalAmount: number
  company: Company
  paymentMethodId: number
  setTotalAmount: (totalAmount: number) => void
  setCompany: (company: Company) => void
  setPaymentMethodId: (paymentMethodId: number) => void
  reset: () => void
}

const initialState = {
  totalAmount: 0,
  company: {} as Company,
  paymentMethodId: 0
}

export const usePaymentStore = create<PaymentState>(set => ({
  ...initialState,
  setTotalAmount: totalAmount => set({ totalAmount }),
  setCompany: company => set({ company }),
  setPaymentMethodId: paymentMethodId => set({ paymentMethodId }),
  reset: () => set(initialState)
}))
