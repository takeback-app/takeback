import React from 'react'

import { Control, Controller } from 'react-hook-form'
import { Radio } from '../../components/input/Radio'

interface MartialStatusInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

const options = [
  { text: 'Solteiro', value: 'SINGLE' },
  { text: 'Casado', value: 'MARRIED' },
  { text: 'Divorciado', value: 'DIVORCED' }
]

export function MaritalStatusInput({ control }: MartialStatusInputProps) {
  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name="maritalStatus"
      render={({ field: { onChange, value, name }, fieldState: { error } }) => (
        <Radio
          label="Estado Civil"
          error={error?.message}
          name={name}
          value={value}
          onChange={onChange}
          options={options}
        />
      )}
    />
  )
}
