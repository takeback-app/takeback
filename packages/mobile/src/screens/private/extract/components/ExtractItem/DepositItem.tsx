import React from 'react'

import { Circle, Flex, HStack, Text, VStack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

import { DepositData } from '../../types'
import { dateFormatSimple, masks } from '../../../../../utils'

type DepositItemProps = DepositData & {
  referenceDate: string
}

export function DepositItem(props: DepositItemProps) {
  const { value } = props

  return (
    <Flex>
      <HStack p="4" space="4" bgColor="white">
        <Circle w="12" h="12" rounded="full" bgColor="gray.300">
          <Ionicons name="cash-outline" size={24} color="black" />
        </Circle>

        <VStack flex="1">
          <Text
            fontWeight="semibold"
            fontSize="md"
            color="gray.800"
            lineHeight="xs"
            mb="1"
          >
            Deposito realizado
          </Text>
          <Text
            fontWeight="normal"
            fontSize="xs"
            color="gray.600"
            lineHeight="xs"
            numberOfLines={2}
          >
            <Ionicons name={'cash-outline'} size={11} color="#838383" /> pago
            com Pix
          </Text>

          <Flex mt={2}>
            <AmountText amount={value} />
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
}

function AmountText({ amount }: CashbackTextProps) {
  if (!amount) {
    return null
  }

  return (
    <Text fontWeight="semibold" fontSize="md" color="green.500">
      + {masks.maskCurrency(amount)}
    </Text>
  )
}
