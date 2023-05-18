export type PaymentMethod = {
  id: number
  description: string
  isTakebackMethod: boolean
  isBackMethod: boolean
  createdAt: Date
  updatedAt: Date
}

export type CompanyPaymentMethod = {
  id: number
  companyId: string
  cashbackPercentage: number
  isActive: boolean
  paymentMethodId: string
  paymentMethod: PaymentMethod
  createdAt: Date
  updatedAt: Date
}
