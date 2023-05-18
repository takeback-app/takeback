import { CompanyPaymentMethodTypes } from './CompanyPaymentMethodTypes'

export type TransactionPaymentMethodTypes = {
  id: number
  cashbackPercentage: number
  cashbackValue: number
  paymentMethod: CompanyPaymentMethodTypes
}
