import React, {
  useState,
  createContext,
  SetStateAction,
  Dispatch,
  ReactNode
} from 'react'
import { PaymentOrderTypes } from '../types/PaymentOrderTypes'
import { TCompanyData } from '../types/TCompanyData'
import { TPaymentOrder } from '../types/TPaymentOrders'

interface IData {
  companyData: TCompanyData
  setCompanyData: Dispatch<SetStateAction<TCompanyData>>

  paymentOrders: TPaymentOrder[]
  setPaymentOrders: Dispatch<SetStateAction<TPaymentOrder[]>>

  paymentMethodsOrder: PaymentOrderTypes[]
  setPaymentMethodsOrder: Dispatch<SetStateAction<PaymentOrderTypes[]>>
}

export const CData = createContext<IData>({} as IData)

interface DataProviderProps {
  children: ReactNode
}

export default function DataProvider({ children }: DataProviderProps) {
  const [companyData, setCompanyData] = useState({} as TCompanyData)
  const [paymentOrders, setPaymentOrders] = useState([] as Array<TPaymentOrder>)
  const [paymentMethodsOrder, setPaymentMethodsOrder] = useState(
    [] as Array<PaymentOrderTypes>
  )

  return (
    <CData.Provider
      value={{
        companyData,
        setCompanyData,
        paymentMethodsOrder,
        setPaymentMethodsOrder,
        paymentOrders,
        setPaymentOrders
      }}
    >
      {children}
    </CData.Provider>
  )
}
