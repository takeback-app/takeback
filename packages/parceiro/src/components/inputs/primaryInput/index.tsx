import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Container, Input, Label } from './styles'

interface Props {
  name: string
  label: string
  type?: string
  marginLeft?: string
  disabled?: boolean
  readOnly?: boolean
  value?: string
  maxLength?: number
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  hidden?: boolean
}

export const PrimaryInput: React.FC<Props> = ({
  name,
  label,
  type = 'text',
  marginLeft,
  disabled,
  value,
  maxLength,
  onChange,
  onBlur,
  onKeyUp,
  readOnly,
  hidden = false,
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
    <Container marginLeft={marginLeft} hidden={hidden}>
      <Input
        ref={inputRef}
        placeholder=" "
        error={error}
        onFocus={clearError}
        onBlur={onBlur}
        type={type}
        onChange={onChange}
        onKeyUp={onKeyUp}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        {...rest}
      />
      <Label error={error}>{label}</Label>
    </Container>
  )
}
