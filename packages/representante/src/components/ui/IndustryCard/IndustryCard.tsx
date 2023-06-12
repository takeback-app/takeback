import React from 'react'

import * as S from './styles'

interface Props {
  title: string
  description: string | number
  onClick: () => void
}

const IndustryCard: React.FC<React.PropsWithChildren<Props>> = ({ title, description, onClick }) => {
  return (
    <S.Container onClick={onClick}>
      <S.TitleCard>{title}</S.TitleCard>
      <S.Description>
        <S.DescriptionCard>Taxa padrão: {description}</S.DescriptionCard>
      </S.Description>
    </S.Container>
  )
}

export default IndustryCard
