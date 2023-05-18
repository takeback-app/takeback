import React, { HTMLInputTypeAttribute, useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Container, Input, Label } from './styles'

interface Props {
  name: string
  label: string
  type?: HTMLInputTypeAttribute | undefined
  marginLeft?: string
  disabled?: boolean
  value?: string
  maxLength?: number
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

export const SecondaryInput: React.FC<Props> = ({
  name,
  label,
  type = 'text',
  marginLeft,
  disabled,
  value,
  maxLength,
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
    <Container marginLeft={marginLeft}>
      <Input
        ref={inputRef}
        placeholder=" "
        error={error}
        onFocus={clearError}
        type={type}
        onChange={onChange}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        {...rest}
      />
      <Label error={error}>{label}</Label>
    </Container>
  )
}
