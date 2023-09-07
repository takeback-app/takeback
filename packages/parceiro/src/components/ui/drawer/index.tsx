import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'
import { useTheme } from 'styled-components'

import * as S from './styles'

import useSWR from 'swr'
import { Dot } from './Dot'
import { IconType } from 'react-icons'
import { Nav } from '../layout/SidebarContent'

export interface Page {
  id: number
  label: string
  inactiveIcon: IconType
  activeIcon: IconType
  isActive: boolean
  to: string
  userBlocked?: number
}

interface Props {
  navData: Nav[]
}

export function Drawer({ navData }: Props) {
  const history = useNavigate()
  const theme = useTheme()

  const { data } = useSWR<{ [key: string]: number }>(
    'company/waiting-solicitations',
    {
      refreshInterval: 10 * 1000 /** 10 segundos */
    }
  )

  const [renderingAux, setRenderingAux] = useState(false)

  const handleDrawerNavigation = (
    id: number,
    to: string,
    subPageId?: number
  ) => {
    navData.map(nav => {
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
  }

  const openSubPages = (id: number) => {
    navData.map(nav => {
      return nav.id === id ? (nav.isOpened = !nav.isOpened) : false
    })

    setRenderingAux(!renderingAux)
  }

  return (
    <S.Content>
      {navData.map(nav => {
        if (nav.pages) {
          return (
            <S.NavWrapperMultiPages key={nav.id}>
              <S.NavWrapper onClick={() => openSubPages(nav.id)}>
                <nav.inactiveIcon color={theme.colors['white-300']} />

                {nav.hasDotKey && data?.[nav.hasDotKey] ? <Dot /> : null}

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
                        <page.activeIcon color={theme.colors['blue-700']} />
                      ) : (
                        <page.inactiveIcon color={theme.colors['white-300']} />
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
              {nav.hasDotKey && data?.[nav.hasDotKey] ? <Dot /> : null}

              {nav.isActive ? (
                <nav.activeIcon color={theme.colors['blue-700']} />
              ) : (
                <nav.inactiveIcon color={theme.colors['white-300']} />
              )}

              <S.Label to={nav.to} isActive={nav.isActive}>
                {nav.label}
              </S.Label>
            </S.NavWrapper>
          )
        }
      })}
    </S.Content>
  )
}
