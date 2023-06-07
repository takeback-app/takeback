import React, { HTMLInputTypeAttribute, useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Input } from './styles'

interface Props {
  name: string
  type?: HTMLInputTypeAttribute | undefined
  disabled?: boolean
  value?: string | number | readonly string[] | undefined
  maxLength?: number
  placeholder?: string
  min?: number
  max?: number
  step?: number
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

const SecondaryInput: React.FC<React.PropsWithChildren<Props>> = ({
  name,
  type = 'text',
  disabled,
  value,
  maxLength,
  placeholder,
  min,
  max,
  step,
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
    <Input
      ref={inputRef}
      placeholder={placeholder}
      error={error}
      onFocus={clearError}
      type={type}
      onChange={onChange}
      value={value}
      min={min}
      max={max}
      step={step}
      maxLength={maxLength}
      disabled={disabled}
      {...rest}
    />
  )
}

export default SecondaryInput
