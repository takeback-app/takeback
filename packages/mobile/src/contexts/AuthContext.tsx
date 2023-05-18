import React, { useState, createContext, SetStateAction } from 'react'

interface IProps {
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<SetStateAction<boolean>>
  isBalanceVisible: boolean
  setIsBalanceVisible: React.Dispatch<SetStateAction<boolean>>
}

interface AuthProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const AuthContext = createContext<IProps>({
  isSignedIn: false,
  setIsSignedIn: () => null,
  isBalanceVisible: false,
  setIsBalanceVisible: () => null
})

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isBalanceVisible, setIsBalanceVisible] = useState(false)

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        isBalanceVisible,
        setIsBalanceVisible
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
