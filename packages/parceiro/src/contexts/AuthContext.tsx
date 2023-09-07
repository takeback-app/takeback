import React, {
  useState,
  createContext,
  SetStateAction,
  ReactNode
} from 'react'

interface IAuth {
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<SetStateAction<boolean>>

  isRootUser: boolean
  setIsRootUser: React.Dispatch<SetStateAction<boolean>>

  isManager: boolean
  setIsManager: React.Dispatch<SetStateAction<boolean>>

  generateCashback: boolean
  setGenerateCashback: React.Dispatch<SetStateAction<boolean>>

  isPageLoading: boolean
  setIsPageLoading: React.Dispatch<SetStateAction<boolean>>

  userName: string
  setUserName: React.Dispatch<SetStateAction<string>>

  companyName: string
  setCompanyName: React.Dispatch<SetStateAction<string>>

  office: string
  setOffice: React.Dispatch<SetStateAction<string>>

  userId: string
  setUserId: React.Dispatch<SetStateAction<string>>

  canAccessClientReport: boolean
  setCanAccessClientReport: React.Dispatch<SetStateAction<boolean>>

  canHaveStoreProducts: boolean
  setCanHaveStoreProducts: React.Dispatch<SetStateAction<boolean>>

  canSendBirthdayNotification: boolean
  setCanSendBirthdayNotification: React.Dispatch<SetStateAction<boolean>>

  canUseIntegration: boolean
  setCanUseIntegration: React.Dispatch<SetStateAction<boolean>>
}

export const AuthContext = createContext<IAuth>({} as IAuth)

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isManager, setIsManager] = useState(false)
  const [isRootUser, setIsRootUser] = useState(false)
  const [generateCashback, setGenerateCashback] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [office, setOffice] = useState('')
  const [userId, setUserId] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [canAccessClientReport, setCanAccessClientReport] = useState(false)
  const [canHaveStoreProducts, setCanHaveStoreProducts] = useState(false)
  const [canSendBirthdayNotification, setCanSendBirthdayNotification] =
    useState(false)
  const [canUseIntegration, setCanUseIntegration] = useState(false)

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        isManager,
        setIsManager,
        isRootUser,
        setIsRootUser,
        isPageLoading,
        setIsPageLoading,
        userName,
        setUserName,
        office,
        setOffice,
        userId,
        setUserId,
        companyName,
        setCompanyName,
        generateCashback,
        setGenerateCashback,
        canAccessClientReport,
        setCanAccessClientReport,
        canHaveStoreProducts,
        setCanHaveStoreProducts,
        canSendBirthdayNotification,
        setCanSendBirthdayNotification,
        canUseIntegration,
        setCanUseIntegration
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
