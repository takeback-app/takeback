import React from 'react'
import { Td, Text, Tr } from '@chakra-ui/react'
import { currencyFormat } from '../../../../utils/currencyFormat'
import { ReceiveTransferData } from '../index'

type ReceiveTransferItemProps = {
  referenceDate: Date
  data: ReceiveTransferData
  type: string
}

export function ReceiveTransferItem(props: ReceiveTransferItemProps) {
  const { data, referenceDate } = props

  return (
    <Tr color="gray.500" key={data.id}>
      <Td px="2" fontSize="xs" w={200}>
        {new Date(referenceDate).toLocaleString()}
      </Td>
      <Td px="2" fontSize="xs">
        <Text>Saldo enviado ({data.sentCompany})</Text>
      </Td>
      <Td px="2" fontSize="xs" w={150}>
        <Text fontWeight="semibold" color="green.600">
          +{currencyFormat(data.value)}
        </Text>
      </Td>
    </Tr>
  )
}
