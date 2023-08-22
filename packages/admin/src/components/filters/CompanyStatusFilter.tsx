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

export function CompanyStatusFilter({
  value,
  setValue,
  name = 'companyStatus',
  label = 'Status da Empresa',
  ...rest
}: Props) {
  const { data, isLoading } = useSWR<Data[]>(
    'manager/report/filters/companyStatus'
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
