import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import * as S from './styles'

interface Props {
  name: string
  label: string
  type?: string
  marginLeft?: string
  disabled?: boolean
  value?: string
  maxLength?: number
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
  autoFocus?: boolean
  withCurrencySymbol?: boolean
  width?: number
}

export const FieldMoney: React.FC<Props> = ({
  name,
  type = 'text',
  marginLeft,
  disabled,
  value,
  maxLength,
  onChange,
  autoFocus,
  withCurrencySymbol = true,
  width,
  ...rest
}) => {
  const inputRef = useRef(null)

  const { fieldName, registerField, error, clearError } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value'
    })
  }, [fieldName, registerField])

  return (
    <S.Container marginLeft={marginLeft}>
      {withCurrencySymbol && <S.LabelCurrency>R$</S.LabelCurrency>}

      <S.Input
        width={width}
        ref={inputRef}
        placeholder=" "
        error={error}
        onFocus={clearError}
        type={type}
        onChange={onChange}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        autoFocus={autoFocus}
        {...rest}
      />
    </S.Container>
  )
}
