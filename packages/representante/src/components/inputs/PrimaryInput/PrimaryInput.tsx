import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Container, Input, Label } from './styles'

interface Props {
  name: string
  label: string
  placeholder?: string
  type?: string
  max?: string
  min?: string
  maxLength?: number
  minLength?: number
  step?: number
  value?: string
  disabled?: boolean
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

const PrimaryInput: React.FC<React.PropsWithChildren<Props>> = ({
  name,
  label,
  disabled,
  value,
  maxLength,
  minLength,
  max,
  min,
  type,
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
    <Container error={error}>
      <Input
        placeholder=" "
        ref={inputRef}
        error={error}
        type={type}
        maxLength={maxLength}
        minLength={minLength}
        max={max}
        min={min}
        disabled={disabled}
        onChange={onChange}
        value={value}
        onFocus={clearError}
        {...rest}
      />
      <Label error={error}>{label}</Label>
    </Container>
  )
}

export default PrimaryInput
