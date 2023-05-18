import { create } from 'zustand'

export type CompanyPaymentMethod = {
  id: number
  paymentMethodId: number
  cashbackPercentage: number
  isActive: boolean
}

export type Company = {
  id: string
  fantasyName: string
  logoUrl?: string
  email: string
  phone: string
  industry: {
    description: string
  }
  companyAddress: {
    id: number
    street: string
    district: string
    number: string
    complement: string
    zipCode: string
    city: {
      name: string
    }
  }
  companyPaymentMethods: CompanyPaymentMethod[]
}

export type CompanyData = Company & {
  isLoading?: boolean
}

type CompaniesState = {
  companies: CompanyData[]
  filteredCompanies: CompanyData[]
  selectedCityName: string | null
  selectedIndustryDescription: string | null
  filter(): void
}

export function filterCompanies(
  companies: CompanyData[],
  cityName?: string | null,
  industryDescription?: string | null
) {
  let filteredCompanies = companies

  if (cityName) {
    filteredCompanies = filteredCompanies.filter(
      c => c.companyAddress.city.name === cityName
    )
  }

  if (industryDescription) {
    filteredCompanies = filteredCompanies.filter(
      c => c.industry.description === industryDescription
    )
  }

  return filteredCompanies
}

export const useCompanies = create<CompaniesState>(set => ({
  companies: [],
  filteredCompanies: [],
  selectedCityName: null,
  selectedIndustryDescription: null,
  filter: () =>
    set(({ companies, selectedCityName, selectedIndustryDescription }) => ({
      hasFilter: !!selectedCityName || !!selectedIndustryDescription,
      filteredCompanies: filterCompanies(
        companies,
        selectedCityName,
        selectedIndustryDescription
      )
    }))
}))
