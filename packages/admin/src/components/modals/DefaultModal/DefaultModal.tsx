import React from 'react'

import * as S from './styles'
interface Props {
  title?: string
  visible?: boolean
  size?: 'extrasmall' | 'small' | 'medium' | 'large' | 'xLarge'
  onClose?: () => void
}

const Colaborator: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  visible,
  onClose,
  size = 'medium',
  children
}) => {
  return (
    <S.Container visible={visible}>
      <S.Content size={size}>
        <S.Header size={size}>
          {title && <S.Title>{title}</S.Title>}
          {onClose && <S.CloseIcon onClick={onClose} />}
        </S.Header>
        <S.Main size={size}>{children}</S.Main>
      </S.Content>
    </S.Container>
  )
}

export default Colaborator
