import { IndustryTypes } from './IndustryTypes'

export type CompanyDataTypes = {
  corporateName: string
  fantasyName: string
  registeredNumber: string
  phone: string
  email: string
  industry: IndustryTypes
  zipCode: string
  positiveBalance: number
  negativeBalance: number
  cashbackPercentDefault: number
  firstAccessAllowedAt: string
  createdAt: string
  currentMonthlyPaymentPaid: boolean
  customMonthlyPayment: boolean
  monthlyPayment: number
  customIndustryFee: number
  customIndustryFeeActive: boolean
  provisionalAccessAllowedAt: string
  permissionToSupportAccess: boolean
  status: {
    id: number
    description: string
    generateCashback: boolean
    blocked: boolean
  }
  paymentPlan: {
    id: number
    description: string
    value: number
  }
}
