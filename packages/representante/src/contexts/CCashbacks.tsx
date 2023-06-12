import React, { useState, createContext, SetStateAction, Dispatch } from 'react'
import { TCashbacks } from '../types/TCashbacks'
import { TCashbackStatus } from '../types/TCashbackStatus'

interface IData {
  cashbacks: TCashbacks
  setCashbacks: Dispatch<SetStateAction<TCashbacks>>

  cashbackStatus: TCashbackStatus[]
  setCashbackStatus: Dispatch<SetStateAction<TCashbackStatus[]>>
}

export const CCashbacks = createContext<IData>({
  cashbacks: {} as TCashbacks,
  setCashbacks: () => null,

  cashbackStatus: [{} as TCashbackStatus],
  setCashbackStatus: () => null
})

const CashbacksProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [cashbacks, setCashbacks] = useState({} as TCashbacks)
  const [cashbackStatus, setCashbackStatus] = useState(
    [] as Array<TCashbackStatus>
  )

  return (
    <CCashbacks.Provider
      value={{
        cashbacks,
        setCashbacks,
        cashbackStatus,
        setCashbackStatus
      }}
    >
      {children}
    </CCashbacks.Provider>
  )
}

export default CashbacksProvider
