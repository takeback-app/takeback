import React, { useEffect } from 'react'
import useSWR from 'swr'
import { ChakraSelect } from '../chakra/ChakraSelect'
import { SelectProps, Spinner } from '@chakra-ui/react'

interface Data {
  id: string
  name: string
}

interface Props extends SelectProps {
  value: string
  companyId?: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

export function CompanyUserFilter({
  setValue,
  companyId,
  value,
  ...rest
}: Props) {
  const { data, isLoading } = useSWR<Data[]>([
    'manager/report/filters/companyUsers',
    { companyId }
  ])

  useEffect(() => {
    setValue(value || '')
  }, [companyId, value, setValue])

  if (!data || isLoading) return <Spinner size="sm" color="blue.500" />

  return (
    <ChakraSelect
      options={[{ id: '', name: 'Todos' }, ...data].map(user => ({
        text: user.name,
        value: user.id
      }))}
      size="sm"
      label="Vendedor"
      name="companyUser"
      value={value}
      onChange={e => setValue(e.target.value)}
      {...rest}
    />
  )
}
