import React from 'react'

import * as S from './styles'

const FilterCard: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <S.Container>
      <S.Content>
        <S.Main>{children}</S.Main>
        <S.Footer></S.Footer>
      </S.Content>
    </S.Container>
  )
}

export default FilterCard
