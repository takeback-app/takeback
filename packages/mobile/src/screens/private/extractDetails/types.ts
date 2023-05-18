export interface Transaction {
  id: number
  totalAmount: string
  amountPayWithOthersMethods: string
  amountPayWithTakebackBalance: string
  takebackFeePercent: string
  takebackFeeAmount: string
  cashbackPercent: string
  cashbackAmount: string
  createdAt: string
  transactionStatusId: number
  backAmount: string
  company: Company
  transactionStatus: TransactionStatus
  transactionPaymentMethods: TransactionPaymentMethod[]
}

export interface Company {
  fantasyName: string
}

export interface TransactionStatus {
  id: number
  description: string
}

export interface TransactionPaymentMethod {
  id: number
  cashbackPercentage: string
  cashbackValue: string
  companyPaymentMethod: CompanyPaymentMethod
}

export interface CompanyPaymentMethod {
  paymentMethod: PaymentMethod
}

export interface PaymentMethod {
  description: string
}
