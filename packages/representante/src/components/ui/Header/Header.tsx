import React, { useContext } from 'react'

import { DrawerContext } from '../../../contexts/DrawerContext'

import DropMenu from '../DropMenu'

import * as S from './styles'

interface Props {
  title?: string
  goBackTitle?: string
  goBack?: () => void
}

const Header: React.FC<React.PropsWithChildren<Props>> = props => {
  const { isOpen, setIsOpen } = useContext(DrawerContext)

  return (
    <S.Container>
      <S.Content>
        {props.goBack ? (
          <S.MenuBack onClick={props.goBack}>
            <S.ArrowBack />
            <S.Title>{props.goBackTitle}</S.Title>
          </S.MenuBack>
        ) : (
          <S.MenuIcon onClick={() => setIsOpen(!isOpen)} />
        )}

        {props.title && <S.Title>{props.title}</S.Title>}
      </S.Content>

      <DropMenu />
    </S.Container>
  )
}

export default Header
