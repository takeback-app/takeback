import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { CustomInput } from '../../../../components/input'
import { UpdateAccountData } from '../FieldsPage'
import { mask } from 'react-native-mask-text'

interface PhoneInputProps {
  control: Control<UpdateAccountData>
}

export function PhoneInput({ control }: PhoneInputProps) {
  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name="phone"
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }
      }) => (
        <CustomInput
          label="Telefone (Com DDD)"
          keyboardAppearance="light"
          keyboardType="numeric"
          maxLength={20}
          onBlur={onBlur}
          isInvalid={!!error?.message}
          error={error?.message}
          onChangeText={text => onChange(mask(text, '(99) 9 9999-9999'))}
          value={value}
        />
      )}
    />
  )
}
