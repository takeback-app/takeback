import React from 'react'
import useSWR from 'swr'
import { ChakraSelect } from '../chakra/ChakraSelect'
import { SelectProps, Spinner } from '@chakra-ui/react'

interface Data {
  id: string
  name: string
}

interface Props extends SelectProps {
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
}

export function StateFilter({ value, setValue, ...rest }: Props) {
  const { data, isLoading } = useSWR<Data[]>('manager/report/filters/states')

  if (!data || isLoading) return <Spinner size="sm" color="blue.500" />

  return (
    <ChakraSelect
      options={[{ id: 0, name: 'Todos' }, ...data].map(state => ({
        text: state.name,
        value: state.id
      }))}
      size="sm"
      label="Estado"
      name="state"
      value={value}
      onChange={e => setValue(Number(e.target.value))}
      {...rest}
    />
  )
}
