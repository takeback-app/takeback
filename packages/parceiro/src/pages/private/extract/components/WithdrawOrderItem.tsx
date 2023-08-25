import React from 'react'
import { Td, Text, Tr } from '@chakra-ui/react'
import { currencyFormat } from '../../../../utils/currencyFormat'
import { WithdrawOrderData } from '../index'

type WithdrawOrderItemProps = {
  referenceDate: Date
  data: WithdrawOrderData
  type: string
}

enum WithdrawOrderStatusEnum {
  REQUESTED_WITHDRAW = 'Saque solicitado',
  CANCELED = 'Cancelada',
  PAID = 'Pago'
}

export function WithdrawOrderItem(props: WithdrawOrderItemProps) {
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
        <Text>Saque do saldo Takeback</Text>
      </Td>
      <Td px="2" fontSize="xs">
        {(() => {
          switch (data.status) {
            case WithdrawOrderStatusEnum.PAID:
              return (
                <Text fontWeight="semibold" color="red.500">
                  -{currencyFormat(data.value)}
                </Text>
              )
            case WithdrawOrderStatusEnum.REQUESTED_WITHDRAW:
              return (
                <Text fontWeight="semibold" color="amber.500">
                  -{currencyFormat(data.value)}
                </Text>
              )
            case WithdrawOrderStatusEnum.CANCELED:
              return (
                <Text fontWeight="semibold" color="black">
                  -{currencyFormat(data.value)}
                </Text>
              )
            default:
              return null
          }
        })()}
      </Td>
    </Tr>
  )
}
