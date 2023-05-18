import React from 'react'

import { Container, Input, Label } from './styles'

interface Props {
  label?: string
  value?: string
  checked?: boolean
  name?: string
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

export const Checkbox: React.FC<Props> = ({
  label,
  checked,
  value,
  name,
  onChange
}) => (
  <Container>
    <Input
      type="checkbox"
      value={value}
      checked={checked}
      onChange={onChange}
      name={name}
    />
    <Label>{label}</Label>
  </Container>
)
