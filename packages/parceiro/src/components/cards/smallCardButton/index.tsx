import React from 'react'
import { SvgIconProps } from '@material-ui/core'

import * as S from './styles'

interface Props {
  color?: string
  icon: React.ComponentType<SvgIconProps>
  title?: string
  onClick?: () => void
}

export const SmallCardButton: React.FC<Props> = props => {
  return (
    <S.Container color={props.color} onClick={props.onClick}>
      <S.IconWrapper>
        <props.icon style={{ color: props.color, fontSize: '1.5rem' }} />
      </S.IconWrapper>
      <S.Title style={{ color: props.color }}>{props.title}</S.Title>
    </S.Container>
  )
}
