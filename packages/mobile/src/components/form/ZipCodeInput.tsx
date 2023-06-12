import React from 'react'

import { Control, Controller } from 'react-hook-form'

import { CustomInput } from '../../components/input'
import { mask } from 'react-native-mask-text'

interface ZipCodeInputProps {
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export function ZipCodeInput({ control, name = 'zipCode' }: ZipCodeInputProps) {
  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }
      }) => (
        <CustomInput
          label="Seu CEP"
          keyboardAppearance="light"
          keyboardType="numeric"
          maxLength={9}
          onBlur={onBlur}
          isInvalid={!!error?.message}
          error={error?.message}
          onChangeText={text => onChange(mask(text, '99999-999'))}
          value={value}
        />
      )}
    />
  )
}
