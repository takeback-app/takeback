export type TCompanyUsers = {
  user_id: string
  user_isActive: boolean
  user_isRootUser: boolean
  user_name: string
}

export type TCompanyUserTypes = {
  id: string
  description: string
  isManager: boolean
}

export type TCompany = {
  id: string
  fantasyName: string
}

export type CompanyUsersTypes = {
  id: string
  name: string
  email: string
  isActive: boolean
  isRootUser: boolean
  companyUserType: TCompanyUserTypes
  company: TCompany
  cpf: string
}
