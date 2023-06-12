import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Container, Label, Option, Select } from './styles'

interface Options {
  id?: string | number
  description?: string
  name?: string
  fantasyName?: string
  monthlyPayment?: string
  fullName?: string
  order_id?: number
}

interface Props {
  label: string
  name: string
  options: Options[]
  disabled?: boolean
  value?: string
  onChange?: (e: React.FormEvent<HTMLSelectElement>) => void
}

const SelectInput: React.FC<React.PropsWithChildren<Props>> = ({
  label,
  options,
  disabled,
  name,
  value,
  onChange
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
    <Container>
      <Label>{label}</Label>
      <Select
        disabled={disabled}
        name={name}
        ref={inputRef}
        value={value}
        onChange={onChange}
      >
        {options?.map(option => (
          <Option key={option.id} value={option.id}>
            {option.description ||
              option.name ||
              option.fantasyName ||
              option.monthlyPayment ||
              option.fullName ||
              option.order_id}
          </Option>
        ))}
      </Select>
    </Container>
  )
}

export default SelectInput
