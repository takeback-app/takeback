import React from 'react'

import { ActivityIndicator } from 'react-native'
import { Control, Controller } from 'react-hook-form'
import useSWR from 'swr'

import { Radio } from '../../../../components/input/Radio'
import { UpdateAccountData } from '../FieldsPage'

interface MonthlyIncomeInputProps {
  control: Control<UpdateAccountData>
}

interface MonthlyIncome {
  id: number
  description: string
}

export function MonthlyIncomeInput({ control }: MonthlyIncomeInputProps) {
  const { data, isLoading } = useSWR<MonthlyIncome[]>(
    `costumer/monthly-incomes`
  )

  if (isLoading || !data) {
    return <ActivityIndicator size="small" />
  }

  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name="monthlyIncomeId"
      render={({ field: { onChange, value, name }, fieldState: { error } }) => (
        <Radio
          label="Renda Mensal"
          error={error?.message}
          name={name}
          value={value}
          onChange={onChange}
          options={data.map(m => ({
            text: m.description,
            value: String(m.id)
          }))}
        />
      )}
    />
  )
}
