import React from 'react'
import { BsFillPiggyBankFill } from 'react-icons/bs'
import { IoBagAdd, IoBagAddOutline } from 'react-icons/io5'
import { RiTimeFill, RiTimeLine } from 'react-icons/ri'
import { useNavigate } from 'react-router'
import { useTheme } from 'styled-components'
import { Dot } from './Dot'

import * as S from './styles'

export const drawerNav = [
  {
    id: 1,
    label: 'Lançamento Manual',
    activeIcon: BsFillPiggyBankFill,
    inactiveIcon: BsFillPiggyBankFill,
    isActive: true,
    to: '/caixa'
  },
  {
    id: 2,
    label: 'Solicitações',
    activeIcon: IoBagAdd,
    inactiveIcon: IoBagAddOutline,
    hasDot: true,
    isActive: false,
    to: '/solicitações'
  },
  {
    id: 3,
    label: 'Histórico',
    activeIcon: RiTimeFill,
    inactiveIcon: RiTimeLine,
    isActive: false,
    to: '/cashbacks/historico'
  }
]

interface MenuNavigationCashierProp {
  count?: number
}

export function MenuNavigationCashier({ count }: MenuNavigationCashierProp) {
  const history = useNavigate()

  const theme = useTheme()

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
          {nav.hasDot && count ? <Dot /> : null}

          {nav.isActive ? (
            <nav.activeIcon color={theme.colors['blue-700']} />
          ) : (
            <nav.inactiveIcon color={theme.colors['white-300']} />
          )}

          <S.Label to={nav.to} isActive={nav.isActive}>
            {nav.label}
          </S.Label>
        </S.NavWrapper>
      ))}
    </S.NavWrapperMultiPages>
  )
}
