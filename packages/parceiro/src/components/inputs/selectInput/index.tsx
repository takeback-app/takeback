import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Container, Label, Option, Select } from './styles'

interface Options {
  id: string | number
  description: string
}

interface Props {
  name: string
  label: string
  options?: Options[]
  disabled?: boolean
  select?: string
  onChange?: (e: React.FormEvent<HTMLSelectElement>) => void
}

export const SelectInput: React.FC<Props> = ({
  label,
  options,
  name,
  select,
  disabled,
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
        ref={inputRef}
        isLabel={label.length !== 0}
        onChange={onChange}
      >
        {options?.map(option => {
          if (select) {
            return (
              <Option
                key={option.id}
                value={option.description}
                selected={select === option.id}
              >
                {option.description}
              </Option>
            )
          } else {
            return (
              <Option key={option.id} value={option.id}>
                {option.description}
              </Option>
            )
          }
        })}
      </Select>
    </Container>
  )
}
