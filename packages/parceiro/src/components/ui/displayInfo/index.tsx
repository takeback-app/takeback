import React from 'react'

import * as S from './styles'

interface Props {
  label?: string
  value?: string | number
}

export const DisplayInfo: React.FC<Props> = props => {
  return (
    <S.Container>
      <S.Description>{props.label}</S.Description>
      <S.Info>{props.value}</S.Info>
    </S.Container>
  )
}
