import React, { useState, createContext, SetStateAction } from 'react'

interface IAuth {
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<SetStateAction<boolean>>
  isAdmin: boolean

  userName: string
  setUserName: React.Dispatch<SetStateAction<string>>

  userEmail: string
  setUserEmail: React.Dispatch<SetStateAction<string>>

  userId: string
  setUserId: React.Dispatch<SetStateAction<string>>

  role: string
  setRole: React.Dispatch<SetStateAction<string>>

  representativeId: string
  setRepresentativeId: React.Dispatch<SetStateAction<string>>

  representativeName: string
  setRepresentativeName: React.Dispatch<SetStateAction<string>>
}

export const AuthContext = createContext<IAuth>({
  isSignedIn: false,
  isAdmin: false,
  setIsSignedIn: () => null,

  userName: '',
  setUserName: () => null,

  userEmail: '',
  setUserEmail: () => null,

  userId: '',
  setUserId: () => null,

  role: '',
  setRole: () => null,

  representativeId: '',
  setRepresentativeId: () => null,

  representativeName: '',
  setRepresentativeName: () => null
})

const AuthProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('')
  const [representativeId, setRepresentativeId] = useState('')
  const [representativeName, setRepresentativeName] = useState('')

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        isAdmin: role === 'ADMIN',
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        userId,
        setUserId,
        role,
        setRole,
        representativeName,
        setRepresentativeName,
        representativeId,
        setRepresentativeId
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
