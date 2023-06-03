import React from 'react'
import Loader from '../../loaders/secondaryLoader'

import * as S from './styles'

interface Props {
  title?: string
  subtitle?: string
  cardColor?: string
  textColor?: string
  loading?: boolean
}

const LargeCard: React.FC<React.PropsWithChildren<Props>> = props => (
  <S.Container cardColor={props.cardColor || '#fff'}>
    <S.Header textColor={props.textColor || '#595959'}>
      <S.Title>{props.title}</S.Title>
      <S.SubTitle>{props.subtitle}</S.SubTitle>
    </S.Header>
    {props.loading ? (
      <S.Main>
        <Loader color="#3A4D5C" />
      </S.Main>
    ) : (
      <S.Main>{props.children}</S.Main>
    )}
  </S.Container>
)

export default LargeCard
