import React, { useState, useRef, useContext } from 'react'
import { MdLogout } from 'react-icons/md'
import { BsKey } from 'react-icons/bs'

import ModalUpdatePassword from './ModalUpdatePassword'

import { AuthContext } from '../../../contexts/AuthContext'

import { getInitials } from '../../../utils/GetInitials'
import PALLET from '../../../styles/ColorPallet'

import * as S from './styles'

const DropMenu: React.FC<React.PropsWithChildren<unknown>> = () => {
  const menuRef = useRef(null)
  const { setIsSignedIn, userName, userEmail } = useContext(AuthContext)

  const [isOpen, setIsOpen] = useState(false)
  const [modalPassword, setModalPassword] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  const handleLogout = () => {
    setIsSignedIn(false)
    localStorage.clear()
    sessionStorage.clear()
  }

  return (
    <>
      <S.Container onClick={toggle}>
        <S.Label>{userName}</S.Label>
        <S.Label2>{getInitials(userName || '')}</S.Label2>
        <S.ArrowDown />
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
          <S.Initials>{getInitials(userName || '')}</S.Initials>
        </S.ProfileCircle>
        <S.FullName>{userName}</S.FullName>
        <S.Email>{userEmail}</S.Email>
        <S.OptionsWrapper>
          <S.OptionsLabel onClick={() => setModalPassword(!modalPassword)}>
            <BsKey /> Redefinir Senha
          </S.OptionsLabel>
        </S.OptionsWrapper>

        <S.IconWrapper onClick={handleLogout}>
          <label style={{ cursor: 'pointer', marginRight: '2px' }}>Sair</label>
          <MdLogout color={PALLET.COLOR_11} />
        </S.IconWrapper>
      </S.MenuWrapper>
      <ModalUpdatePassword
        isActive={modalPassword}
        setIsActive={setModalPassword}
      />
    </>
  )
}

export default DropMenu
