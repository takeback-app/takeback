import React from 'react'

import { Control, Controller } from 'react-hook-form'

import { CustomInput } from '../../components/input'

interface NameInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export function NameInput({ control }: NameInputProps) {
  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name="name"
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }
      }) => (
        <CustomInput
          label="Nome completo"
          keyboardType="default"
          autoCapitalize="words"
          keyboardAppearance="light"
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
