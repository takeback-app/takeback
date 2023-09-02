import React, { useEffect } from 'react'
import useSWR from 'swr'
import { ChakraSelect } from '../chakra/ChakraSelect'
import { SelectProps, Spinner } from '@chakra-ui/react'

interface Data {
  id: string
  name: string
}

interface ResponseData {
  companyStates: Data[]
  consumerStates: Data[]
}

type ResponseDataKeys = keyof ResponseData

interface Props extends SelectProps {
  value: number
  haveTransactions?: string
  setValue: React.Dispatch<React.SetStateAction<number>>
  filterType: ResponseDataKeys
}

export function StateFilter({
  value,
  setValue,
  haveTransactions,
  filterType = 'companyStates',
  ...rest
}: Props) {
  const { data, isLoading } = useSWR<ResponseData>([
    'manager/report/filters/states',
    { haveTransactions }
  ])

  useEffect(() => {
    setValue(value || 0)
  }, [haveTransactions, value, setValue])

  if (!data || isLoading) return <Spinner size="sm" color="blue.500" />

  return (
    <ChakraSelect
      options={[
        { id: 0, name: 'Todos' },
        ...(data && data[filterType] ? data[filterType] : [])
      ].map(state => ({
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
