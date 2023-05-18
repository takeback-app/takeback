import React, { ReactNode } from 'react'
import { Loader } from '../../loaders/secondaryLoader'

import * as S from './styles'

interface LargeCardProps {
  title?: string
  subtitle?: string
  cardColor?: string
  textColor?: string
  loading?: boolean
  children: ReactNode
}

export function LargeCard({
  children,
  cardColor,
  loading,
  subtitle,
  textColor,
  title
}: LargeCardProps) {
  return (
    <S.Container cardColor={cardColor || '#fff'}>
      <S.Header textColor={textColor || '#595959'}>
        <S.Title>{title}</S.Title>
        <S.SubTitle>{subtitle}</S.SubTitle>
      </S.Header>
      {loading ? (
        <S.Main>
          <Loader color="#3A4D5C" />
        </S.Main>
      ) : (
        <S.Main>{children}</S.Main>
      )}
    </S.Container>
  )
}
