import React from 'react'
import { Td, Text, Tr } from '@chakra-ui/react'
import { currencyFormat } from '../../../../utils/currencyFormat'
import { TransactionData } from '../index'

type TransactionItemProps = {
  referenceDate: Date
  data: TransactionData
  type: string
}

export function TransactionItem(props: TransactionItemProps) {
  const { data, referenceDate } = props

  return (
    <Tr color="gray.500" key={data.id}>
      <Td px="2" fontSize="xs" w={200}>
        {new Date(referenceDate).toLocaleString()}
      </Td>
      <Td px="2" fontSize="xs">
        <Text>Recebimento Takeback ({data.consumerFullName})</Text>
      </Td>
      <Td px="2" fontSize="xs" w={150}>
        <Text fontWeight="semibold" color="green.600">
          +{currencyFormat(data.totalAmount)}
        </Text>
      </Td>
    </Tr>
  )
}
