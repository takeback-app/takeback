import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useMemo
} from 'react'
import { UserDataTypes } from '../types/responseApi/UserDataTypes'

interface IProps {
  userData: UserDataTypes
  balance: number
  balanceExpireDate?: Date
  setUserData: Dispatch<SetStateAction<UserDataTypes>>
  setBalanceExpireDate: Dispatch<SetStateAction<Date | undefined>>
}

interface DataProvider {
  children: JSX.Element | JSX.Element[]
}

export const UserDataContext = createContext<IProps>({
  userData: {} as UserDataTypes,
  balance: 0,
  setUserData: () => null,
  setBalanceExpireDate: () => null
})

const DataProvider: React.FC<DataProvider> = ({ children }) => {
  const [balanceExpireDate, setBalanceExpireDate] = useState<Date | undefined>()
  const [userData, setUserData] = useState({} as UserDataTypes)

  const balance = useMemo(() => {
    if (!userData.balance) return 0

    // Para evitar o erro de um centavo (4.3074 -> 4.31)
    // Assim sempre (4.3074 -> 4.30)
    return Math.floor(userData.balance * 100) / 100
  }, [userData])

  return (
    <UserDataContext.Provider
      value={{
        userData,
        setUserData,
        balance,
        setBalanceExpireDate,
        balanceExpireDate
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export default DataProvider
