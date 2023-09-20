import React from 'react'

import { Circle, Flex, HStack, Text, VStack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

import { QRCodeType, QRCodeData } from '../../types'
import { dateFormatSimple } from '../../../../../utils'

const titleByType: { [key in QRCodeType]: string } = {
  WAITING: 'Analisando QRCode ',
  NOT_VALIDATED: 'QRCode invalido'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconByStatus: { [key in QRCodeType]: any } = {
  NOT_VALIDATED: 'close-circle-outline',
  WAITING: 'time-outline'
}

type QRCodeItemProps = QRCodeData & {
  referenceDate: string
}

export function QRCodeItem(props: QRCodeItemProps) {
  const { type, companyName, description } = props

  return (
    <Flex>
      <HStack p="4" space="4" bgColor="white">
        <Circle w="12" h="12" rounded="full" bgColor="gray.300">
          <Ionicons name="qr-code-outline" size={24} color="black" />
        </Circle>

        <VStack flex="1">
          <Text
            fontWeight="semibold"
            fontSize="md"
            color="gray.800"
            lineHeight="xs"
            mb="1"
          >
            {titleByType[type]}
          </Text>
          <Text
            fontWeight="normal"
            fontSize="xs"
            color="gray.600"
            textTransform="capitalize"
            lineHeight="xs"
            numberOfLines={2}
          >
            <Ionicons name={'business-outline'} size={11} color="#838383" />{' '}
            {companyName}
          </Text>
          <Text
            fontWeight="normal"
            fontSize="xs"
            color="gray.600"
            lineHeight="xs"
            numberOfLines={2}
          >
            <Ionicons
              name={iconByStatus[type] ?? 'checkmark-circle-outline'}
              size={12}
              color="#838383"
            />{' '}
            {description || 'Aguarde analise do QRCODE'}
          </Text>

          {/* <Flex mt={2}>
            <AmountText amount={amount} status={props.status} />
          </Flex> */}
        </VStack>

        <Text fontWeight="medium" fontSize="xs" color="gray.600">
          {dateFormatSimple(props.referenceDate).toUpperCase()}
        </Text>
      </HStack>
    </Flex>
  )
}

// interface CashbackTextProps {
//   amount: number
//   status: QRCodeStatus
// }

// const statusColor = {
//   WAITING: 'amber.500',
//   CANCELED: 'black'
// }

// function AmountText({ amount, status }: CashbackTextProps) {
//   if (!amount) {
//     return null
//   }

//   return (
//     <Text fontWeight="semibold" fontSize="md" color={statusColor[status]}>
//       {masks.maskCurrency(amount)}
//     </Text>
//   )
// }
