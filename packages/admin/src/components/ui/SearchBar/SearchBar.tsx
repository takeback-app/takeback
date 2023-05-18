import React, { LegacyRef } from 'react'
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5'

import Loader from '../../loaders/secondaryLoader'

import * as S from './styles'

interface Props {
  loading?: boolean
  placeholder?: string
  info?: string
  ref?: LegacyRef<HTMLFormElement>
  onSearch?: (e: React.FormEvent<HTMLInputElement>) => void
  onCancel?: () => void
}

const SearchBar = React.forwardRef<HTMLFormElement, Props>((props, ref) => {
  return (
    <S.Wrapper ref={ref}>
      <S.Container>
        {props.loading ? (
          <Loader color="#797979" />
        ) : (
          <IoSearchOutline color="#797979" />
        )}

        <S.Input
          type="text"
          onChange={props.onSearch}
          placeholder={props.placeholder}
        />

        <IoCloseOutline
          onClick={props.onCancel}
          style={{ cursor: 'pointer' }}
          color="#bababa"
        />
      </S.Container>
      <S.Info>{props.info}</S.Info>
    </S.Wrapper>
  )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar
