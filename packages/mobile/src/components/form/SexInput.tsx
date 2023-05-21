import React from 'react'

import { Control, Controller } from 'react-hook-form'
import { Radio } from '../../components/input/Radio'

interface SexInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export function SexInput({ control }: SexInputProps) {
  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name="sex"
      render={({ field: { onChange, value, name }, fieldState: { error } }) => (
        <Radio
          label="Sexo"
          error={error?.message}
          direction="row"
          name={name}
          value={value}
          onChange={onChange}
          options={[
            { text: 'Masculino', value: 'MALE' },
            { text: 'Feminino', value: 'FEMALE' }
          ]}
        />
      )}
    />
  )
}
