import { create } from 'zustand'

export type Sex = 'M' | 'F'

export interface CreateAccountFormData {
  cpf: string
  name: string
  zipCode: string
  birthday: string
  sex: Sex
  email: string
  phone: string
  maritalStatus: string
  schooling: string
  monthlyIncomeId: string
  hasChildren: string
}

interface SignUpState extends CreateAccountFormData {
  setValue: <K extends keyof CreateAccountFormData>(
    key: K,
    value: CreateAccountFormData[K]
  ) => void
  getFormData: () => CreateAccountFormData
  reset: () => void
}

const initialState = {
  cpf: '',
  name: '',
  zipCode: '',
  birthday: '',
  sex: 'M' as Sex,
  email: '',
  phone: '',
  maritalStatus: '',
  schooling: '',
  monthlyIncomeId: '',
  hasChildren: ''
}

export const useSignUp = create<SignUpState>((set, get) => ({
  ...initialState,
  setValue: (key, value) => set({ [key]: value }),
  getFormData: () => {
    const data = get()

    return {
      cpf: data.cpf,
      name: data.name,
      zipCode: data.zipCode,
      birthday: data.birthday,
      sex: data.sex,
      email: data.email,
      phone: data.phone,
      maritalStatus: data.maritalStatus,
      schooling: data.schooling,
      monthlyIncomeId: data.monthlyIncomeId,
      hasChildren: data.hasChildren
    }
  },
  reset: () => set(initialState)
}))
