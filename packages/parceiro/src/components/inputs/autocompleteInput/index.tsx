import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import {
  Container,
  Autocomplete,
  Label,
  Option,
  OptionsContainer,
  InputContainer
} from './styles'

interface Props {
  options: string[]
  name: string
  label: string
  type?: string
  marginLeft?: string
  disabled?: boolean
  value?: string
  maxLength?: number
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleSelectOption: (e: React.FormEvent<HTMLDivElement>) => void
  autoFocus?: boolean
  isOpen: boolean
}

export const AutocompleteInput: React.FC<Props> = ({
  options,
  name,
  label,
  type = 'text',
  marginLeft,
  disabled,
  value,
  maxLength,
  onChange,
  onBlur,
  onKeyUp,
  handleSelectOption,
  autoFocus,
  isOpen,
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
    <Container marginLeft={marginLeft}>
      <InputContainer>
        <Label error={error}>{label}</Label>
        <Autocomplete
          ref={inputRef}
          placeholder=" "
          error={error}
          onFocus={clearError}
          type={type}
          onKeyUp={onKeyUp}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          autoFocus={autoFocus}
          {...rest}
        />
      </InputContainer>
      <InputContainer>
        <OptionsContainer hidden={!isOpen}>
          {options?.map(option => {
            return (
              <Option key={option} onClick={e => handleSelectOption(e)}>
                {option}
              </Option>
            )
          })}
        </OptionsContainer>
      </InputContainer>
    </Container>
  )
}
