import React, { useEffect } from 'react'
import useSWR from 'swr'
import { ChakraSelect } from '../chakra/ChakraSelect'
import { SelectProps, Spinner } from '@chakra-ui/react'

interface Data {
  id: string
  name: string
}

interface Props extends SelectProps {
  value: number
  stateId?: number
  setValue: React.Dispatch<React.SetStateAction<number>>
}

export function CityFilter({ setValue, stateId, value, ...rest }: Props) {
  const { data, isLoading } = useSWR<Data[]>([
    'manager/report/filters/cities',
    { stateId }
  ])

  useEffect(() => {
    setValue(0)
  }, [stateId, setValue])

  if (!data || isLoading) return <Spinner size="sm" color="blue.500" />

  return (
    <ChakraSelect
      options={[{ id: 0, name: 'Todas' }, ...data].map(city => ({
        text: city.name,
        value: city.id
      }))}
      size="sm"
      label="Cidade"
      name="city"
      value={value}
      onChange={e => setValue(Number(e.target.value))}
      {...rest}
    />
  )
}
