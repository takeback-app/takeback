import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'

import { AuthContext } from '../../../contexts/AuthContext'
import { drawerNav } from './DrawerNavigations'

import * as S from './styles'
import { MenuNavigationCashier } from './MenuNavigationCashier'

import PALLET from '../../../styles/ColorPallet'

export const Drawer: React.FC = () => {
  const history = useNavigate()

  const { role } = useContext(AuthContext)

  const isAdmin = role === 'ADMIN'

  const [renderingAux, setRenderingAux] = useState(false)

  const handleDrawerNavigation = (
    id: number,
    to: string,
    subPageId?: number
  ) => {
    drawerNav.map(nav => {
      if (nav.id === id) {
        if (nav.pages) {
          return nav.pages.map(page => {
            if (page.id === subPageId) {
              return (page.isActive = true)
            } else {
              return (page.isActive = false)
            }
          })
        } else {
          return (nav.isActive = true)
        }
      } else {
        nav.pages &&
          nav.pages.map(page => {
            return (page.isActive = false)
          })
        return (nav.isActive = false)
      }
    })

    history(to)

    // if (window.innerWidth < 1070) {
    //   setIsOpen(false)
    // }
  }

  const openSubPages = (id: number) => {
    drawerNav.map(nav => {
      return nav.id === id ? (nav.isOpened = !nav.isOpened) : false
    })

    setRenderingAux(!renderingAux)
  }

  return (
    <S.Content>
      {isAdmin ? (
        drawerNav.map(nav => {
          if (nav.pages) {
            return (
              <S.NavWrapperMultiPages key={nav.id}>
                <S.NavWrapper onClick={() => openSubPages(nav.id)}>
                  <nav.inactiveIcon color={PALLET.BACKGROUND} />

                  <S.LabelMultiPages>
                    {nav.label}
                    {nav.isOpened ? <IoChevronDown /> : <IoChevronUp />}
                  </S.LabelMultiPages>
                </S.NavWrapper>
                {nav.isOpened &&
                  nav.pages.map(page => {
                    return (
                      <S.NavWrapperVariant
                        key={page.id}
                        isActive={page.isActive}
                        isOpened={true}
                        onClick={() =>
                          handleDrawerNavigation(nav.id, page.to, page.id)
                        }
                      >
                        {page.isActive ? (
                          <page.activeIcon color={PALLET.COLOR_06} />
                        ) : (
                          <page.inactiveIcon color={PALLET.BACKGROUND} />
                        )}
                        <S.Label to={page.to} isActive={page.isActive}>
                          {page.label}
                        </S.Label>
                      </S.NavWrapperVariant>
                    )
                  })}
              </S.NavWrapperMultiPages>
            )
          } else {
            return (
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
            )
          }
        })
      ) : (
        <MenuNavigationCashier />
      )}
    </S.Content>
  )
}
