import React from 'react'
import { Td, Text, Tr } from '@chakra-ui/react'
import { currencyFormat } from '../../../../utils/currencyFormat'
import { PaymentOrdersData } from '../index'

type PaymentOrdersItemProps = {
  referenceDate: Date
  data: PaymentOrdersData
  type: string
}

enum PaymentOrderStatusEnum {
  REQUESTED_PAYMENT = 'Pagamento solicitado',
  CANCELED = 'Cancelada',
  AUTHORIZED = 'Autorizada',
  WAITING_CONFIRMATION = 'Aguardando confirmacao'
}

export function PaymentOrdersItem(props: PaymentOrdersItemProps) {
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
        <Text>Pagamento de cashbacks</Text>
      </Td>
      <Td px="2" fontSize="xs">
        {(() => {
          switch (data.paymentOrderStatus) {
            case PaymentOrderStatusEnum.AUTHORIZED:
              return (
                <Text fontWeight="semibold" color="red.500">
                  -{currencyFormat(data.value)}
                </Text>
              )
            case PaymentOrderStatusEnum.REQUESTED_PAYMENT ||
              PaymentOrderStatusEnum.WAITING_CONFIRMATION:
              return (
                <Text fontWeight="semibold" color="amber.500">
                  -{currencyFormat(data.value)}
                </Text>
              )
            case PaymentOrderStatusEnum.CANCELED:
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
