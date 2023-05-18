import React, { useState, createContext, SetStateAction } from 'react'

interface IAuth {
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<SetStateAction<boolean>>

  userName: string
  setUserName: React.Dispatch<SetStateAction<string>>

  userEmail: string
  setUserEmail: React.Dispatch<SetStateAction<string>>

  userType: number
  setUserType: React.Dispatch<SetStateAction<number>>

  isRoot: boolean
  setIsRoot: React.Dispatch<SetStateAction<boolean>>
}

export const AuthContext = createContext<IAuth>({
  isSignedIn: false,
  setIsSignedIn: () => null,

  userName: '',
  setUserName: () => null,

  userEmail: '',
  setUserEmail: () => null,

  userType: 3,
  setUserType: () => null,

  isRoot: false,
  setIsRoot: () => null
})

const AuthProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userType, setUserType] = useState(3)
  const [isRoot, setIsRoot] = useState(false)

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        userType,
        setUserType,
        isRoot,
        setIsRoot
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
