import { create } from 'zustand'
import { Company } from './index'

interface PaymentState {
  totalAmount: number
  company: Company
  paymentMethodId: number
  companyUserId?: string
  qrCodeLink?: string
  setTotalAmount: (totalAmount: number) => void
  setCompany: (company: Company) => void
  setCompanyUserId: (id: string) => void
  setQRCodeLink: (link: string) => void
  setPaymentMethodId: (paymentMethodId: number) => void
  reset: () => void
}

const initialState = {
  totalAmount: 0,
  company: {} as Company,
  companyUserId: undefined,
  qrCodeLink: undefined,
  paymentMethodId: 0
}

export const usePaymentStore = create<PaymentState>(set => ({
  ...initialState,
  setTotalAmount: totalAmount => set({ totalAmount }),
  setCompany: company => set({ company }),
  setCompanyUserId: id => set({ companyUserId: id }),
  setQRCodeLink: link => set({ qrCodeLink: link }),
  setPaymentMethodId: paymentMethodId => set({ paymentMethodId }),
  reset: () => set(initialState)
}))
