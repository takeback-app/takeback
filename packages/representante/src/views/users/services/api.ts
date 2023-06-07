import { AxiosError } from 'axios'
import { API } from '../../../services/API'
import { removeMask } from '../../../utils/masks'

type ReturnApi = [boolean, { message?: string }]

export interface CreateRepresentativeUsersForm {
  name: string
  email: string
  phone: string
  birthday: string
  cpf: string
  password: string
}

export interface EditRepresentativeUsersForm {
  name: string
  email: string
  phone: string
  birthday: string
  cpf: string
  password?: string
}

export async function createRepresentativeUser(
  data: CreateRepresentativeUsersForm
): Promise<ReturnApi> {
  data.cpf = removeMask(data.cpf)
  data.phone = removeMask(data.phone)

  try {
    await API.post('representative/consultants', data)

    return [true, { message: 'Consultor cadastrado!' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function editRepresentativeUser(
  id: string,
  data: EditRepresentativeUsersForm
): Promise<ReturnApi> {
  data.cpf = removeMask(data.cpf)
  data.phone = removeMask(data.phone)

  try {
    await API.put(`representative/consultants/${id}`, data)

    return [true, { message: 'Consultor editado!' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function deleteRepresentativeUser(id: string): Promise<ReturnApi> {
  try {
    await API.delete(`representative/consultants/${id}`)

    return [true, { message: 'Consultor deletado!' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
