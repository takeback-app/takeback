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
  const { data, referenceDate } = props

  return (
    <Tr color="gray.500" key={data.id}>
      <Td px="2" fontSize="xs" w={200}>
        {new Date(referenceDate).toLocaleString()}
      </Td>
      <Td px="2" fontSize="xs">
        <Text>Pagamento de Mensalidade</Text>
      </Td>
      <Td px="2" fontSize="xs" w={150}>
        <Text fontWeight="semibold" color="red.600">
          -{currencyFormat(data.amountPaid)}
        </Text>
      </Td>
    </Tr>
  )
}
