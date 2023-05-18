import React, { useState, useRef, useContext } from 'react'
import { IoLogOutOutline, IoPersonOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router'
import { useTheme } from 'styled-components'

import { AuthContext } from '../../../contexts/AuthContext'
import { getInitials } from '../../../utils/GetInitials'

import * as S from './styles'

export const DropMenu: React.FC = () => {
  const menuRef = useRef(null)
  const navigateTo = useNavigate()
  const theme = useTheme()

  const { setIsSignedIn, setIsPageLoading, companyName, office } =
    useContext(AuthContext)

  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  const handleLogout = () => {
    setIsSignedIn(false)
    setIsPageLoading(false)
    localStorage.clear()
    sessionStorage.clear()
  }

  return (
    <>
      <S.Container onClick={toggle}>
        <S.Label>{companyName}</S.Label>
        <S.Label2>{getInitials(companyName)}</S.Label2>
        {isOpen ? <S.ArrowUp /> : <S.ArrowDown />}
      </S.Container>

      <S.MenuWrapper
        ref={menuRef}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.40)',
            backdropFilter: 'blur(4px)'
          }
        }}
      >
        <S.ProfileCircle>
          <S.Initials>{getInitials(companyName)}</S.Initials>
        </S.ProfileCircle>
        <S.FullName>{companyName}</S.FullName>
        <S.Email>{office}</S.Email>

        <S.OptionsWrapper>
          <S.OptionsLabel onClick={() => navigateTo('/configuracoes/perfil')}>
            <IoPersonOutline /> Meu usuário
          </S.OptionsLabel>
        </S.OptionsWrapper>

        <S.LogoutButton
          onClick={handleLogout}
          style={{ color: theme.colors['gray-600'] }}
        >
          <strong>Sair</strong>
          <IoLogOutOutline
            color={theme.colors['gray-600']}
            style={{ marginLeft: 4, fontSize: 20 }}
          />
        </S.LogoutButton>
      </S.MenuWrapper>
    </>
  )
}
