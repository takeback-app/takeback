import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Select, Container, Label, Option } from './styles'

interface IOptions {
  id?: string | number
  description?: string
  fantasyName?: string
}

interface Props {
  name: string
  label: string
  select?: string
  value?: string
  disabled?: boolean
  options?: IOptions[]
}

export const SelectInputWithBorder: React.FC<Props> = ({
  name,
  label,
  options,
  select,
  disabled
}) => {
  const inputRef = useRef(null)
  const { fieldName, registerField, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value'
    })
  }, [fieldName, registerField])

  return (
    <Container error={error}>
      <Label>{label}</Label>
      <Select ref={inputRef} disabled={disabled}>
        {options?.map(option => {
          if (select) {
            return (
              <Option
                key={option.id}
                selected={select === option.id}
                value={option.description || option.fantasyName}
              >
                {option.description || option.fantasyName}
              </Option>
            )
          } else {
            return (
              <Option key={option.id} value={option.id}>
                {option.description || option.fantasyName}
              </Option>
            )
          }
        })}
      </Select>
    </Container>
  )
}
