import React from 'react'
import useSWR from 'swr'
import { ChakraSelect } from '../chakra/ChakraSelect'
import { SelectProps, Spinner } from '@chakra-ui/react'

interface Data {
  id: string
  description: string
}

interface Props extends SelectProps {
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
  label?: string
}

export function PaymentMethodFilter({
  value,
  setValue,
  name = 'paymentMethod',
  label = 'Forma de pagamento',
  ...rest
}: Props) {
  const { data, isLoading } = useSWR<Data[]>(
    'manager/report/filters/paymentMethods'
  )

  if (!data || isLoading) return <Spinner size="sm" color="blue.500" />

  return (
    <ChakraSelect
      options={[{ id: 0, description: 'Todos' }, ...data].map(status => ({
        text: status.description,
        value: status.id
      }))}
      size="sm"
      label={label}
      name={name}
      value={value}
      onChange={e => setValue(Number(e.target.value))}
      {...rest}
    />
  )
}
