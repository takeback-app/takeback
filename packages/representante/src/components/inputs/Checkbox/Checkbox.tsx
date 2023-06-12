import React from 'react'

import { Container, Input, Label } from './styles'

interface CheckboxProps {
  label?: string
  value?: string
  checked?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Checkbox: React.FC<React.PropsWithChildren<CheckboxProps>> = ({
  label,
  value,
  checked,
  onChange
}) => (
  <Container>
    <Input
      type="checkbox"
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <Label>{label}</Label>
  </Container>
)

export default Checkbox
