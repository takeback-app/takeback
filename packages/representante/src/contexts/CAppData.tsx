import React, { useState, createContext, SetStateAction, Dispatch } from 'react'
import { TCity } from '../types/TCity'
import { TIndustry } from '../types/TIndustry'
import { TPayment } from '../types/TPayment'
import { TPaymentOrder } from '../types/TPaymentOrder'
import { TPaymentOrderMethods } from '../types/TPaymentOrderMethods'
import { TPaymentOrderStatus } from '../types/TPaymentOrderStatus'
import { TPlan } from '../types/TPlan'

interface IAppData {
  industries: TIndustry[]
  setIndustries: Dispatch<SetStateAction<TIndustry[]>>

  cities: TCity[]
  setCities: Dispatch<SetStateAction<TCity[]>>

  payments: TPayment[]
  setPayments: Dispatch<SetStateAction<TPayment[]>>

  plans: TPlan[]
  setPlans: Dispatch<SetStateAction<TPlan[]>>

  paymentOrders: TPaymentOrder[]
  setPaymentOrders: Dispatch<SetStateAction<TPaymentOrder[]>>

  paymentOrderMethods: TPaymentOrderMethods[]
  setPaymentOrderMethods: Dispatch<SetStateAction<TPaymentOrderMethods[]>>

  paymentOrderStatus: TPaymentOrderStatus[]
  setPaymentOrderStatus: Dispatch<SetStateAction<TPaymentOrderStatus[]>>

  offset: number
  setOffset: Dispatch<SetStateAction<number>>

  endList: boolean
  setEndList: Dispatch<SetStateAction<boolean>>
}

export const CAppData = createContext<IAppData>({
  industries: [{} as TIndustry],
  setIndustries: () => null,

  cities: [{} as TCity],
  setCities: () => null,

  payments: [{} as TPayment],
  setPayments: () => null,

  plans: [{} as TPlan],
  setPlans: () => null,

  paymentOrders: [{} as TPaymentOrder],
  setPaymentOrders: () => null,

  paymentOrderMethods: [{} as TPaymentOrderMethods],
  setPaymentOrderMethods: () => null,

  paymentOrderStatus: [{} as TPaymentOrderStatus],
  setPaymentOrderStatus: () => null,

  offset: 1,
  setOffset: () => null,

  endList: false,
  setEndList: () => null
})

const AppDataProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const [industries, setIndustries] = useState([] as Array<TIndustry>)
  const [cities, setCities] = useState([] as Array<TCity>)
  const [payments, setPayments] = useState([] as Array<TPayment>)
  const [plans, setPlans] = useState([] as Array<TPlan>)
  const [paymentOrders, setPaymentOrders] = useState([] as Array<TPaymentOrder>)
  const [paymentOrderMethods, setPaymentOrderMethods] = useState(
    [] as Array<TPaymentOrderMethods>
  )
  const [paymentOrderStatus, setPaymentOrderStatus] = useState(
    [] as Array<TPaymentOrderStatus>
  )
  const [offset, setOffset] = useState(1)
  const [endList, setEndList] = useState(false)

  return (
    <CAppData.Provider
      value={{
        industries,
        setIndustries,
        endList,
        setEndList,
        offset,
        setOffset,
        cities,
        setCities,
        payments,
        setPayments,
        paymentOrders,
        setPaymentOrders,
        paymentOrderMethods,
        setPaymentOrderMethods,
        paymentOrderStatus,
        setPaymentOrderStatus,
        plans,
        setPlans
      }}
    >
      {children}
    </CAppData.Provider>
  )
}

export default AppDataProvider
