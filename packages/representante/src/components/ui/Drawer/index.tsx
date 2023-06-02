import React, { useContext } from 'react'

import { AuthContext } from '../../../contexts/AuthContext'

import * as S from './styles'
import { ConsultantNavigationMenu } from './ConsultantNavigationMenu'
import { AdminNavigationMenu } from './AdminNavigationMenu'

export const Drawer: React.FC = () => {
  const { role } = useContext(AuthContext)

  const isAdmin = role === 'ADMIN'

  return (
    <S.Content>
      {isAdmin ? <AdminNavigationMenu /> : <ConsultantNavigationMenu />}
    </S.Content>
  )
}
