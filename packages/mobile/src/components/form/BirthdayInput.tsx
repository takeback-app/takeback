import React from 'react'

import { Control, Controller } from 'react-hook-form'

import { CustomInput } from '../../components/input'
import { mask } from 'react-native-mask-text'

interface BirthdayInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export function BirthdayInput({ control }: BirthdayInputProps) {
  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name="birthday"
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }
      }) => (
        <>
          <CustomInput
            label="Data de Nascimento"
            keyboardAppearance="light"
            keyboardType="numeric"
            maxLength={10}
            onBlur={onBlur}
            onChangeText={text => onChange(mask(text, '99/99/9999'))}
            isInvalid={!!error?.message}
            error={error?.message}
            value={value}
          />
        </>
      )}
    />
  )
}
