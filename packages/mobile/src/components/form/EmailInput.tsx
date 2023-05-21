import React from 'react'

import { Control, Controller } from 'react-hook-form'

import { CustomInput } from '../../components/input'

interface EmailInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export function EmailInput({ control }: EmailInputProps) {
  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name="email"
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }
      }) => (
        <CustomInput
          label="E-mail"
          keyboardAppearance="light"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          maxLength={40}
          onBlur={onBlur}
          isInvalid={!!error?.message}
          error={error?.message}
          onChangeText={onChange}
          value={value}
        />
      )}
    />
  )
}
