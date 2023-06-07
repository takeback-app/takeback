import React from 'react'

import Loader from 'react-spinners/PuffLoader'

import * as S from './styles'

interface Props {
  open?: boolean
  searchPlaceholder?: string
  toggleSearch?: () => void
  searchCancel?: () => void
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
  loadingSearch?: boolean
}

const SearchHeader: React.FC<React.PropsWithChildren<Props>> = ({
  open,
  searchPlaceholder,
  onChange,
  toggleSearch,
  searchCancel,
  loadingSearch
}) => {
  return (
    <S.Container open={open}>
      {loadingSearch === true ? (
        <Loader color="#666" />
      ) : (
        <S.SearchIcon onClick={toggleSearch} />
      )}
      {open && (
        <S.Input
          onChange={onChange}
          placeholder={searchPlaceholder}
          autoFocus
        />
      )}
      {open && <S.CloseIcon onClick={searchCancel} />}
    </S.Container>
  )
}

export default SearchHeader
