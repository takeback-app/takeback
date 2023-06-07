import React from 'react'

import * as S from './styles'
interface Props {
  title?: string
  visible?: boolean
  onClose?: () => void
}

const FilterModal: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  visible,
  onClose,
  children
}) => {
  return (
    <S.Container visible={visible}>
      <S.Content>
        <S.Header>
          <S.Title>{title}</S.Title>
          {onClose && <S.CloseIcon onClick={onClose} />}
        </S.Header>
        <S.Main>{children}</S.Main>
      </S.Content>
    </S.Container>
  )
}

export default FilterModal
