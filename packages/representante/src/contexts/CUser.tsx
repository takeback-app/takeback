import React, { useState, createContext, SetStateAction, Dispatch } from 'react'
import { TUser } from '../types/TUser'
import { TSupportUser } from '../types/TSupportUser'
import { TUserType } from '../types/TUserType'

interface ICUser {
  users: TUser[]
  setUsers: Dispatch<SetStateAction<TUser[]>>

  supportUsers: TSupportUser[]
  setSupportUsers: Dispatch<SetStateAction<TSupportUser[]>>

  offSetUser: number
  setOffSetUser: Dispatch<SetStateAction<number>>

  endListUser: boolean
  setEndListUser: Dispatch<SetStateAction<boolean>>

  userType: TUserType[]
  setUserType: Dispatch<SetStateAction<TUserType[]>>
}

export const CUser = createContext<ICUser>({
  users: [{} as TUser],
  setUsers: () => null,

  supportUsers: [{} as TSupportUser],
  setSupportUsers: () => null,

  offSetUser: 1,
  setOffSetUser: () => null,

  endListUser: false,
  setEndListUser: () => null,

  userType: [{} as TUserType],
  setUserType: () => null
})

const UserProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const [users, setUsers] = useState([] as Array<TUser>)
  const [supportUsers, setSupportUsers] = useState([] as Array<TSupportUser>)
  const [offSetUser, setOffSetUser] = useState(1)
  const [endListUser, setEndListUser] = useState(false)
  const [userType, setUserType] = useState([] as Array<TUserType>)

  return (
    <CUser.Provider
      value={{
        users,
        setUsers,
        offSetUser,
        setOffSetUser,
        endListUser,
        setEndListUser,
        userType,
        setUserType,
        supportUsers,
        setSupportUsers
      }}
    >
      {children}
    </CUser.Provider>
  )
}

export default UserProvider
