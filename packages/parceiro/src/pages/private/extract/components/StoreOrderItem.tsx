import React from 'react'
import { Td, Text, Tr } from '@chakra-ui/react'
import { currencyFormat } from '../../../../utils/currencyFormat'
import { StoreOrderData } from '../index'

type StoreOrderItemProps = {
  referenceDate: Date
  data: StoreOrderData
  type: string
}

export function StoreOrderItem(props: StoreOrderItemProps) {
  const { data, referenceDate, type } = props

  return (
    <Tr color="gray.500" key={data.id}>
      <Td px="2" fontSize="xs">
        {new Date(referenceDate).toLocaleString()}
      </Td>
      <Td px="2" fontSize="xs">
        <Text>{type}</Text>
      </Td>
      <Td px="2" fontSize="xs">
        <Text>{data.productName}</Text>
      </Td>
      <Td px="2" fontSize="xs">
        <Text fontWeight="semibold" color="green.600">
          +{currencyFormat(data.companyCreditValue * data.quantity)}
        </Text>
      </Td>
    </Tr>
  )
}
