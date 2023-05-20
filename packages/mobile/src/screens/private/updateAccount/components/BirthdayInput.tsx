import React from 'react'

import { Control, Controller } from 'react-hook-form'

import { UpdateAccountData } from '../FieldsPage'
import { CustomInput } from '../../../../components/input'
import { mask } from 'react-native-mask-text'

interface BirthdayInputProps {
  control: Control<UpdateAccountData>
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
