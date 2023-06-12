import { TUserType } from './TUserType'

export type TUser = {
  id: string
  name: string
  cpf: string
  phone: string
  office: string
  value: number
  isActive: boolean
  email: string
  password?: string
  generatePassword?: boolean
  userType: TUserType
}
