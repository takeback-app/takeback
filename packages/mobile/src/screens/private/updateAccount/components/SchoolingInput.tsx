import React from 'react'

import { Control, Controller } from 'react-hook-form'
import { Radio } from '../../../../components/input/Radio'
import { UpdateAccountData } from '../FieldsPage'

interface SchoolingInputProps {
  control: Control<UpdateAccountData>
}

const options = [
  { text: 'Superior Completo', value: 'GRADUATED' },
  {
    text: 'Nível Médio Completo',
    value: 'COMPLETE_HIGH_SCHOOL'
  },
  {
    text: 'Fundamental Completo',
    value: 'COMPLETE_PRIMARY_EDUCATION'
  },
  { text: 'Não Alfabetizado', value: 'ILLITERATE' }
]

export function SchoolingInput({ control }: SchoolingInputProps) {
  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name="schooling"
      render={({ field: { onChange, value, name }, fieldState: { error } }) => (
        <Radio
          label="Escolaridade"
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
