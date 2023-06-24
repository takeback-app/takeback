import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Container, Input, Label } from './styles'

interface Props {
  name: string
  label: string
  type?: string
  marginLeft?: string
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

export const PercentInput: React.FC<Props> = ({
  name,
  label,
  type = 'number',
  marginLeft,
  onChange,
  ...rest
}) => {
  const inputRef = useRef(null)

  const { fieldName, registerField } = useField(name)

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
        type={type}
        onChange={onChange}
        step={0.1}
        {...rest}
      />
      <Label>{label}</Label>
    </Container>
  )
}
