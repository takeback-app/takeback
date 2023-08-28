export type TCompany = {
  company_id: string
  company_corporateName: string
  company_fantasyName: string
  company_registeredNumber: string
  company_email: string
  company_phone: string
  company_logoUrl: string | null
  company_customIndustryFee: number
  company_customIndustryFeeActive: boolean
  company_positiveBalance: number
  company_negativeBalance: number
  company_monthlyPayment: number
  company_representativeId: string
  industry_description: string
  industry_industryFee: number
  status_description: string
  status_id: number
  address_street: string
  address_district: string
  address_number: number
  address_longitude: string
  address_latitude: string
  city_name: string
  plan_id: number
  plan_description: string
  plan_value: number
}
