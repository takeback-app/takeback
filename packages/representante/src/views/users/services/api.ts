import { AxiosError } from 'axios'
import { API } from '../../../services/API'

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
  id: string
  name: string
  email: string
  phone: string
  birthday: string
  cpf: string
  password: string
}

export async function createRepresentativeUser(
  data: CreateRepresentativeUsersForm
): Promise<ReturnApi> {
  try {
    await API.post('representative/users', {
      data: data
    })

    return [true, { message: 'Usuário cadastrado com sucesso' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}

export async function editRepresentativeUser(
  data: EditRepresentativeUsersForm
): Promise<ReturnApi> {
  try {
    await API.put(`representative/users/${data.id}`, {
      data: data
    })

    return [true, { message: 'Usuário editado com sucesso' }]
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
    await API.delete(`representative/users/${id}`)

    return [true, { message: 'Usuário deletado com sucesso' }]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
