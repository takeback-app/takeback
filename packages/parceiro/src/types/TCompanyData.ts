export type TIndustry = {
  id: number
  description: string
  industryFee: number
}

export type TCompanyData = {
  id: string
  corporateName: string
  fantasyName: string
  registeredNumber: string
  email: string
  phone: string
  customIndustryFee: number
  customIndustryFeeActive: boolean
  positiveBalance: number
  negativeBalance: number
  monthlyPayment: number
  createdAt: string
  updatedAt: string
  industry: TIndustry
}
