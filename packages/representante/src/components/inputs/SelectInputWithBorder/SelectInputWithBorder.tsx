import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Select, Container, Label, Option } from './styles'

interface IOptions {
  id?: string | number
  description?: string
  fantasyName?: string
  name?: string
}

interface Props {
  name: string
  label: string
  select?: string
  value?: string
  disabled?: boolean
  options?: IOptions[]
}

const SelectInputWithBorder: React.FC<React.PropsWithChildren<Props>> = ({
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
                value={option.description || option.fantasyName || option.name}
              >
                {option.description || option.fantasyName || option.name}
              </Option>
            )
          } else {
            return (
              <Option key={option.id} value={option.id}>
                {option.description || option.fantasyName || option.name}
              </Option>
            )
          }
        })}
      </Select>
    </Container>
  )
}

export default SelectInputWithBorder
