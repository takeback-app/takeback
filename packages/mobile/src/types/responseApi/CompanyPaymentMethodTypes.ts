import { PaymentMethodTypes } from './PaymentMethodTypes'

export type CompanyPaymentMethodTypes = {
  id: number
  cashbackPercentage: string
  paymentMethod: PaymentMethodTypes
}
