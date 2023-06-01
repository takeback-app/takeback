import React from 'react'
import { RiTimeFill, RiTimeLine } from 'react-icons/ri'
import { useNavigate } from 'react-router'

import * as S from './styles'
import PALLET from '../../../styles/ColorPallet'
import {
  IoGift,
  IoGiftOutline,
  IoGrid,
  IoGridOutline,
  IoStorefront,
  IoStorefrontOutline
} from 'react-icons/io5'

export const drawerNav = [
  {
    id: 0,
    label: 'Dashboard',
    activeIcon: IoGrid,
    inactiveIcon: IoGridOutline,
    isActive: true,
    to: '/dashboard',
    userBlocked: 0
  },
  {
    id: 2,
    label: 'Empresas',
    activeIcon: IoStorefront,
    inactiveIcon: IoStorefrontOutline,
    isActive: false,
    to: '/empresas',
    userBlocked: 0
  },
  {
    id: 4,
    label: 'Sorteios',
    activeIcon: IoGift,
    inactiveIcon: IoGiftOutline,
    isActive: false,
    to: '/sorteios',
    userBlocked: 0
  },
  {
    id: 5,
    label: 'Histórico',
    activeIcon: RiTimeFill,
    inactiveIcon: RiTimeLine,
    isActive: false,
    to: '/cashbacks/historico',
    userBlocked: 0
  }
]

export function MenuNavigationCashier() {
  const history = useNavigate()

  function handleDrawerNavigation(id: number, to: string) {
    for (const nav of drawerNav) {
      nav.isActive = nav.id === id
    }

    history(to)
  }

  return (
    <S.NavWrapperMultiPages>
      {drawerNav.map(nav => (
        <S.NavWrapper
          key={nav.id}
          isActive={nav.isActive}
          onClick={() => handleDrawerNavigation(nav.id, nav.to)}
        >
          {nav.isActive ? (
            <nav.activeIcon color={PALLET.COLOR_06} />
          ) : (
            <nav.inactiveIcon color={PALLET.BACKGROUND} />
          )}

          <S.Label to={nav.to} isActive={nav.isActive}>
            {nav.label}
          </S.Label>
        </S.NavWrapper>
      ))}
    </S.NavWrapperMultiPages>
  )
}
