import React, {
  useState,
  createContext,
  SetStateAction,
  ReactNode
} from 'react'
import { AccessControlTypes } from '../components/ui/drawer/managerNav'

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

  accessControl: AccessControlTypes
  setAccessControl: React.Dispatch<SetStateAction<AccessControlTypes>>
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
  const [accessControl, setAccessControl] = useState<AccessControlTypes>([])

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
        accessControl,
        setAccessControl
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
