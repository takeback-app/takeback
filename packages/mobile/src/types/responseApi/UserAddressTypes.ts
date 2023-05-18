import { UserAddressCityTypes } from './UserAddressCityTypes'

export type UserAddressTypes = {
  id: number
  street: string
  district: string
  number: string
  city: UserAddressCityTypes
  complement: string
  zipCode: string
}
