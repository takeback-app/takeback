import React, { useEffect } from 'react'
import useSWR from 'swr'
import { ChakraSelect } from '../chakra/ChakraSelect'
import { SelectProps, Spinner } from '@chakra-ui/react'

interface Data {
  id: string
  fantasyName: string
}

interface Props extends SelectProps {
  value: string
  cityId?: number
  statusId?: number
  stateId?: number
  setValue: React.Dispatch<React.SetStateAction<string>>
}

export function CompanyFilter({
  setValue,
  cityId,
  statusId,
  stateId,
  value,
  ...rest
}: Props) {
  const { data, isLoading } = useSWR<Data[]>([
    'manager/report/filters/companies',
    { cityId, statusId, stateId }
  ])

  useEffect(() => {
    setValue('')
  }, [cityId, statusId, setValue])

  if (!data || isLoading) return <Spinner size="sm" color="blue.500" />

  return (
    <ChakraSelect
      options={[{ id: '', fantasyName: 'Todas' }, ...data].map(city => ({
        text: city.fantasyName,
        value: city.id
      }))}
      size="sm"
      label="Empresa"
      name="company"
      value={value}
      onChange={e => setValue(e.target.value)}
      {...rest}
    />
  )
}
