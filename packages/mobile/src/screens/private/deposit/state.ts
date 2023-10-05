import { create } from 'zustand'

export type PixTransaction = {
  id: string
  reference: string
  txId: string
  locId: number
  value: string
  status: string
  copiaCola: string
  qrCodeImage: string
  data: {
    linkVisualizacao: string
    pixCreateImmediateCharge: {
      loc: {
        id: number
        criacao: string
        tipoCob: string
        location: string
      }
      txid: string
      chave: string
      valor: {
        original: string
      }
      status: string
      devedor: {
        cpf: string
        nome: string
      }
      revisao: number
      location: string
      calendario: {
        criacao: string
        expiracao: number
      }
    }
  }
  createdAt: string
}

interface DepositState {
  totalAmount: number
  pix: PixTransaction | null
  setTotalAmount: (totalAmount: number) => void
  setPix: (pix: PixTransaction) => void
  reset: () => void
}

const initialState = {
  totalAmount: 0,
  pix: null
}

export const useDepositStore = create<DepositState>(set => ({
  ...initialState,
  setTotalAmount: totalAmount => set({ totalAmount }),
  setPix: pix => set({ pix }),
  reset: () => set(initialState)
}))
