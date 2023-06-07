import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Input, Container, Label, TextArea } from './styles'

interface Props {
  name: string
  label: string
  isTextArea?: boolean
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
  value?: string
  min?: number
  max?: number
  disabled?: boolean
  type?: React.HTMLInputTypeAttribute | undefined
}

const TertiaryInput: React.FC<React.PropsWithChildren<Props>> = ({
  name,
  label,
  isTextArea,
  value,
  min,
  max,
  onChange,
  disabled,
  type,
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
      {isTextArea ? (
        <Container error={error}>
          <TextArea
            ref={inputRef}
            placeholder=" "
            error={error}
            onFocus={clearError}
            value={value}
            disabled={disabled}
            maxLength={max}
            {...rest}
          />
          <Label isTextArea>{label}</Label>
        </Container>
      ) : (
        <Container error={error}>
          <Input
            ref={inputRef}
            placeholder=" "
            maxLength={max}
            minLength={min}
            error={error}
            onFocus={clearError}
            onChange={onChange}
            value={value}
            type={type}
            disabled={disabled}
            {...rest}
          />
          <Label>{label}</Label>
        </Container>
      )}
    </div>
  )
}

export default TertiaryInput
