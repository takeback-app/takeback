import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'

import * as S from './styles'

interface Props {
  name: string
  label: string
  placeholder?: string
  visible?: boolean
  value?: string
  disabled?: boolean
  toggle?: () => void
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

export const PasswordInput: React.FC<Props> = ({
  name,
  label,
  visible,
  disabled,
  value,
  toggle,
  onChange,
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
    <div style={{ width: '100%' }}>
      <S.Container error={error}>
        <S.Input
          placeholder=" "
          ref={inputRef}
          error={error}
          type={visible ? 'text' : 'password'}
          disabled={disabled}
          onChange={onChange}
          value={value}
          onFocus={clearError}
          minLength={4}
          {...rest}
        />
        <S.Label error={error}>{label}</S.Label>
        <S.VisiblePassWrapper>
          {visible ? (
            <IoEyeOutline onClick={toggle} size={'1.5rem'} cursor={'pointer'} />
          ) : (
            <IoEyeOffOutline
              onClick={toggle}
              size={'1.5rem'}
              cursor={'pointer'}
            />
          )}
        </S.VisiblePassWrapper>
      </S.Container>
    </div>
  )
}
