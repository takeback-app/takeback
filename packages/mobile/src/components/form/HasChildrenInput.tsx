import React from 'react'

import { Control, Controller } from 'react-hook-form'
import { Radio } from '../../components/input/Radio'

interface HasChildrenInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

const options = [
  { text: 'Sim', value: 'sim' },
  {
    text: 'Não',
    value: 'não'
  }
]

export function HasChildrenInput({ control }: HasChildrenInputProps) {
  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name="hasChildren"
      render={({ field: { onChange, value, name }, fieldState: { error } }) => (
        <Radio
          label="Tem filhos?"
          direction="row"
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
