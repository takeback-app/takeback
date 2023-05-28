import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'

import { AuthContext } from '../../../contexts/AuthContext'
import { DrawerContext } from '../../../contexts/DrawerContext'
import { drawerNav } from './DrawerNavigations'

import PALLET from '../../../styles/ColorPallet'

import * as S from './styles'

const Drawer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const history = useNavigate()
  const { isOpen, setIsOpen } = useContext(DrawerContext)
  // const { userType } = useContext(AuthContext)

  const [renderingAux, setRenderingAux] = useState(false)

  const handleDrawerNavigation = (
    pageId: number,
    to: string,
    subPageId?: number
  ) => {
    drawerNav.map(nav => {
      if (nav.id === pageId) {
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

    if (window.innerWidth < 1024) {
      setIsOpen(false)
    }
  }

  const openSubPages = (id: number) => {
    drawerNav.map(nav => {
      return nav.id === id ? (nav.isOpened = !nav.isOpened) : false
    })

    setRenderingAux(!renderingAux)
  }

  return (
    // <S.Container isOpen={isOpen}>
    //   <S.LogoWrapper>
    //     <S.Logo src={isOpen ? LogoHorizontal : Logo} />
    //   </S.LogoWrapper>
    <S.Content>
      {drawerNav.map(nav => {
        if (nav.pages) {
          return (
            <S.NavWrapperMultiPages key={nav.id}>
              <S.NavWrapper onClick={() => openSubPages(nav.id)}>
                <nav.inactiveIcon color={PALLET.BACKGROUND} />

                {isOpen && (
                  <S.LabelMultiPages>
                    {nav.label}
                    {nav.isOpened ? <IoChevronDown /> : <IoChevronUp />}
                  </S.LabelMultiPages>
                )}
              </S.NavWrapper>
              {nav.isOpened &&
                nav.pages.map(page => {
                  return (
                    <S.NavWrapperVariant
                      key={page.id}
                      isActive={page.isActive}
                      isOpened={isOpen}
                      onClick={() =>
                        handleDrawerNavigation(nav.id, page.to, page.id)
                      }
                    >
                      {page.isActive ? (
                        <page.activeIcon color={PALLET.COLOR_06} />
                      ) : (
                        <page.inactiveIcon color={PALLET.BACKGROUND} />
                      )}
                      {isOpen && (
                        <S.Label to={page.to} isActive={page.isActive}>
                          {page.label}
                        </S.Label>
                      )}
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
              {isOpen && (
                <S.Label to={nav.to} isActive={nav.isActive}>
                  {nav.label}
                </S.Label>
              )}
            </S.NavWrapper>
          )
        }
      })}
    </S.Content>
    // </S.Container>
  )
}

export default Drawer
