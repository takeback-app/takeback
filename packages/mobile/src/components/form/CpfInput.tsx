import React from 'react'

import { Control, Controller } from 'react-hook-form'

import { CustomInput } from '../../components/input'
import { mask } from 'react-native-mask-text'

interface CpfInputProps {
  isDisabled?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export function CpfInput({ control, isDisabled = false }: CpfInputProps) {
  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name="cpf"
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }
      }) => (
        <CustomInput
          keyboardType="numeric"
          keyboardAppearance="light"
          maxLength={14}
          onBlur={onBlur}
          selectTextOnFocus={false}
          editable={!isDisabled}
          isDisabled={isDisabled}
          isInvalid={!!error?.message}
          error={error?.message}
          onChangeText={e => onChange(mask(e, '999.999.999-99'))}
          value={value}
          label="CPF"
        />
      )}
    />
  )
}
