import React from 'react'

import { Control, Controller } from 'react-hook-form'

import { CustomInput, CustomInputProps } from '../../components/input'

interface GenericInputProps extends CustomInputProps {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export function GenericInput({
  control,
  name,
  isRequired,
  ...rest
}: GenericInputProps) {
  return (
    <Controller
      control={control}
      rules={{ required: isRequired ? 'O campo é obrigatório' : undefined }}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }
      }) => (
        <CustomInput
          keyboardAppearance="light"
          maxLength={40}
          onBlur={onBlur}
          isInvalid={!!error?.message}
          error={error?.message}
          onChangeText={onChange}
          value={value}
          {...rest}
        />
      )}
    />
  )
}
