import { UserAddressTypes } from './UserAddressTypes'

export type UserDataTypes = {
  id: string
  fullName: string
  sex?: string
  phone: string
  email: string
  cpf: string
  birthDate: string
  balance: number
  blockedBalance: number
  emailConfirmated: boolean
  signatureRegistered: boolean
  address: UserAddressTypes
  totalSaved: number
}
