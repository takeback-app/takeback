import React from 'react'
import { Td, Text, Tr } from '@chakra-ui/react'
import { currencyFormat } from '../../../../utils/currencyFormat'
import { MonthlyPaymentsData } from '../index'

type MonthlyPaymentItemProps = {
  referenceDate: Date
  data: MonthlyPaymentsData
  type: string
}

export function MonthlyPaymentItem(props: MonthlyPaymentItemProps) {
  const { data, referenceDate, type } = props

  return (
    <Tr color="gray.500" key={data.id}>
      <Td px="2" fontSize="xs">
        {new Date(referenceDate).toLocaleString()}
      </Td>
      <Td px="2" fontSize="xs">
        <Text w="20">{type}</Text>
      </Td>
      <Td px="2" fontSize="xs">
        <Text w="20">Mensalidade</Text>
      </Td>
      <Td px="2" fontSize="xs">
        <Text w="16" fontWeight="semibold" color="red.600">
          -{currencyFormat(data.amountPaid)}
        </Text>
      </Td>
    </Tr>
  )
}
