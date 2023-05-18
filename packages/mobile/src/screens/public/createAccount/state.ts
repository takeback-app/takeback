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
}

interface SignUpState extends CreateAccountFormData {
  setValue: <K extends keyof CreateAccountFormData>(
    key: K,
    value: CreateAccountFormData[K]
  ) => void
  reset: () => void
}

const initialState = {
  cpf: '',
  name: '',
  zipCode: '',
  birthday: '',
  sex: 'M' as Sex,
  email: '',
  phone: ''
}

export const useSignUp = create<SignUpState>(set => ({
  ...initialState,
  setValue: (key, value) => set({ [key]: value }),
  reset: () => set(initialState)
}))
