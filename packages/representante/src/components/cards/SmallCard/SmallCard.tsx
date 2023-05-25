import React from 'react'
import { SvgIconProps } from '@material-ui/core'
import { IoInformationCircleOutline } from 'react-icons/io5'
import Loader from '../../loaders/secondaryLoader'

import * as S from './styles'

interface Props {
  bgColor?: string
  color?: string
  icon: React.ComponentType<React.PropsWithChildren<SvgIconProps>>
  title?: string
  description?: string
  label?: string
  loading?: boolean
}

const SmallCard: React.FC<React.PropsWithChildren<Props>> = props => {
  return props.loading ? (
    <S.ContainerLoader>
      <Loader color="#3A4D5C" />
    </S.ContainerLoader>
  ) : (
    <S.Container>
      <S.TopWrapper>
        <S.LeftWrapper>
          <S.Title>{props.title}</S.Title>
          <S.Description>{props.description}</S.Description>
        </S.LeftWrapper>
        <S.RightWrapper>
          <S.IconWrapper color={props.color}>
            <props.icon style={{ color: props.color, fontSize: 22 }} />
          </S.IconWrapper>
        </S.RightWrapper>
      </S.TopWrapper>

      <S.BottomWrapper>
        <IoInformationCircleOutline style={{ color: '#94a3b8' }} />
        <S.Label>{props.label}</S.Label>
      </S.BottomWrapper>
    </S.Container>
  )
}

export default SmallCard
