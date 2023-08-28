import moment from 'moment'
import { create } from 'zustand'

export interface FormData {
  dateStart: string
  dateEnd: string
  bonusType?: string
}

interface State extends FormData {
  setForm: (formData: FormData) => void
  reset: () => void
}

const initialState = {
  dateStart: moment().subtract(1, 'month').format('YYYY-MM-DD'),
  dateEnd: moment().format('YYYY-MM-DD'),
  bonusType: undefined
}

export const useExtract = create<State>(set => ({
  ...initialState,
  setForm: (form: FormData) => set(form),
  reset: () => set(initialState)
}))
