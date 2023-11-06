import React from 'react'
import { Td, Text, Tr } from '@chakra-ui/react'
import { currencyFormat } from '../../../../utils/currencyFormat'
import { SentTransferData } from '../index'

type SentTransferItemProps = {
  referenceDate: Date
  data: SentTransferData
  type: string
}

export function SentTransferItem(props: SentTransferItemProps) {
  const { data, referenceDate } = props

  return (
    <Tr color="gray.500" key={data.id}>
      <Td px="2" fontSize="xs" w={200}>
        {new Date(referenceDate).toLocaleString()}
      </Td>
      <Td px="2" fontSize="xs">
        <Text>Saldo enviado ({data.receiveCompany})</Text>
      </Td>
      <Td px="2" fontSize="xs" w={150}>
        <Text fontWeight="semibold" color="red.500">
          -{currencyFormat(data.value)}
        </Text>
      </Td>
    </Tr>
  )
}
