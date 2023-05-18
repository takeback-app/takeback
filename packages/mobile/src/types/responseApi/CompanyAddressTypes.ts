import { UserAddressCityTypes } from './UserAddressCityTypes'

export type CompanyAddressTypes = {
  id: number
  street: string
  district: string
  number: string
  city: UserAddressCityTypes
  complement: string
}
