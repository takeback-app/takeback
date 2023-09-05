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
  const { data, referenceDate } = props

  return (
    <Tr color="gray.500" key={data.id}>
      <Td px="2" fontSize="xs" w={200}>
        {new Date(referenceDate).toLocaleString()}
      </Td>
      <Td px="2" fontSize="xs">
        <Text>Loja de ofertas ({data.productName})</Text>
      </Td>
      <Td px="2" fontSize="xs" w={150}>
        <Text fontWeight="semibold" color="green.600">
          +{currencyFormat(data.companyCreditValue)}
        </Text>
      </Td>
    </Tr>
  )
}
