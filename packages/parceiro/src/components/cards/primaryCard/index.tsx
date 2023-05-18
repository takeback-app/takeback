import React from 'react'

import * as S from './styles'

interface Props {
  color?: string
  // eslint-disable-next-line
  icon?: any
  title?: string
  onClick?: () => void
}

export const PrimaryCard: React.FC<Props> = props => {
  return (
    <S.Container color={props.color} onClick={props.onClick}>
      <S.IconWrapper>
        {props.icon && <props.icon size={80} color="#ffffff2b" />}
      </S.IconWrapper>
      <S.Title>{props.title}</S.Title>
    </S.Container>
  )
}
