import React from 'react'

import { Container, Input, Label } from './styles'

interface Props {
  name: string
  label: string
  placeholder?: string
  type?: string
  max?: string
  min?: string
  maxLength?: number
  value?: string
  disabled?: boolean
  readOnly?: boolean
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

const PrimaryInputNotForm: React.FC<React.PropsWithChildren<Props>> = ({
  name,
  label,
  placeholder,
  disabled,
  readOnly,
  value,
  maxLength,
  max,
  min,
  type,
  onChange
}) => {
  return (
    <Container>
      <Input
        placeholder={placeholder}
        type={type}
        maxLength={maxLength}
        max={max}
        name={name}
        min={min}
        disabled={disabled}
        onChange={onChange}
        value={value}
        readOnly={readOnly}
      />
      <Label error={false}>{label}</Label>
    </Container>
  )
}

export default PrimaryInputNotForm
