import React from 'react'

import { Ionicons } from '@expo/vector-icons'
import { Circle, Flex, HStack, Text, VStack } from 'native-base'

import { dateFormatSimple, masks } from '../../../../../utils'
import { BalanceExpirationData } from '../../types'

type TransactionItemProps = BalanceExpirationData & {
  referenceDate: string
}

export function BalanceExpirationItem(props: TransactionItemProps) {
  return (
    <Flex>
      <HStack p="4" space="4" bgColor="white">
        <Circle w="12" h="12" rounded="full" bgColor="gray.300">
          <Ionicons name="calendar-sharp" size={24} color="black" />
        </Circle>

        <VStack flex="1">
          <Text
            fontWeight="semibold"
            fontSize="md"
            color="gray.800"
            lineHeight="xs"
            mb="1"
          >
            Saldo expirado
          </Text>
          <Text
            fontWeight="normal"
            fontSize="xs"
            color="gray.600"
            lineHeight="xs"
            numberOfLines={2}
          >
            Seu saldo expirou por falta de movimentação nos últimos 4 meses.
          </Text>

          <Flex mt={2}>
            <AmountText amount={props.amount} />
          </Flex>
        </VStack>

        <Text fontWeight="medium" fontSize="xs" color="gray.600">
          {dateFormatSimple(props.referenceDate).toUpperCase()}
        </Text>
      </HStack>
    </Flex>
  )
}

interface AmountTextProps {
  amount: number
}

function AmountText({ amount }: AmountTextProps) {
  if (!amount) {
    return null
  }

  return (
    <Text fontWeight="semibold" fontSize="md" color="red.400">
      - {masks.maskCurrency(amount)}
    </Text>
  )
}
