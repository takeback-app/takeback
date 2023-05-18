import React from 'react'

import { Circle, Flex, HStack, Text, VStack } from 'native-base'
import { Feather, Ionicons } from '@expo/vector-icons'

import {
  SolicitationData,
  SolicitationStatus,
  SolicitationType
} from '../../types'
import { dateFormatSimple, masks } from '../../../../../utils'

const titleByType: { [key in SolicitationType]: string } = {
  CASHBACK: 'Solicitação de cashback',
  PAYMENT: 'Solicitação de pagamento'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconByStatus: { [key in SolicitationStatus]: any } = {
  APPROVED: 'checkmark-circle-outline',
  CANCELED: 'close-circle-outline',
  WAITING: 'time-outline'
}

const textByStatus: { [key in SolicitationStatus]: string } = {
  APPROVED: 'Aprovado',
  CANCELED: 'Cancelado',
  WAITING: 'Aguardando aprovação'
}

type SolicitationItemProps = SolicitationData & {
  referenceDate: string
}

export function SolicitationItem(props: SolicitationItemProps) {
  const { type, companyName, status, amount } = props

  return (
    <Flex>
      <HStack p="4" space="4" bgColor="white">
        <Circle w="12" h="12" rounded="full" bgColor="gray.300">
          <Feather name="clock" size={24} color="black" />
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
              name={iconByStatus[status] ?? 'checkmark-circle-outline'}
              size={12}
              color="#838383"
            />{' '}
            {textByStatus[status]}
          </Text>

          <Flex mt={2}>
            <AmountText amount={amount} status={props.status} />
          </Flex>
        </VStack>

        <Text fontWeight="medium" fontSize="xs" color="gray.600">
          {dateFormatSimple(props.referenceDate).toUpperCase()}
        </Text>
      </HStack>
    </Flex>
  )
}

interface CashbackTextProps {
  amount: number
  status: SolicitationStatus
}

const statusColor = {
  WAITING: 'amber.500',
  CANCELED: 'black'
}

function AmountText({ amount, status }: CashbackTextProps) {
  if (!amount) {
    return null
  }

  return (
    <Text fontWeight="semibold" fontSize="md" color={statusColor[status]}>
      {masks.maskCurrency(amount)}
    </Text>
  )
}
