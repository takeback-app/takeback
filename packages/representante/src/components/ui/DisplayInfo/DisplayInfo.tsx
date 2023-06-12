import React from 'react'

import * as S from './styles'

interface Props {
  label?: string
  value?: string | number
}

const DisplayInfo: React.FC<React.PropsWithChildren<Props>> = props => {
  return (
    <S.Container>
      <S.Description>{props.label}</S.Description>
      <S.Info>{props.value}</S.Info>
    </S.Container>
  )
}

export default DisplayInfo
