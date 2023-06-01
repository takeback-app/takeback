export type CompanyUserTypesTypes = {
  id: string
  description: string
  isManager: boolean
}

export type CompanyUsersTypes = {
  id: string
  name: string
  email: string
  isActive: boolean
  isRootUser: boolean
  companyUserType: CompanyUserTypesTypes
  cpf: string
}
