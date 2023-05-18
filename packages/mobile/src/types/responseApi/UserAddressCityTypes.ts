import { UserAddressStateTypes } from './UserAddressStateTypes'

export type UserAddressCityTypes = {
  id: number
  name: string
  ibgeCode: string
  state: UserAddressStateTypes
}
