export type RepresentativeUsers = {
  id: string
  name: string
  cpf: string
  email: string
  phone: string
  isActive: boolean
  role: 'ADMIN' | 'CONSULTANT'
  birthDay: number
  birthMonth: number
  birthYear: number
  representativeId: string
}
