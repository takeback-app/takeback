import React from 'react'

import { Circle, Flex, HStack, Text, VStack } from 'native-base'
import { Feather, Ionicons } from '@expo/vector-icons'

import { SolicitationStatus, StoreOrderData } from '../../types'
import { dateFormatSimple, masks } from '../../../../../utils'

type SolicitationItemProps = StoreOrderData & {
  referenceDate: string
}

export function StoreOrderItem(props: SolicitationItemProps) {
  const { id, companyName, productName, quantity, referenceDate, value } = props

  return (
    <Flex>
      <HStack p="4" space="4" bgColor="white">
        <Circle w="12" h="12" rounded="full" bgColor="gray.300">
          <Ionicons name="ios-cart-outline" size={24} color="black" />
        </Circle>

        <VStack flex="1">
          <Text
            fontWeight="semibold"
            fontSize="md"
            color="gray.800"
            lineHeight="xs"
            mb="1"
          >
            Compra realizada
          </Text>
          <Text
            fontWeight="normal"
            fontSize="xs"
            color="gray.600"
            lineHeight="xs"
            numberOfLines={2}
          >
            {quantity}x {productName}
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
    <Text fontWeight="semibold" fontSize="md" color="red.400">
      - {masks.maskCurrency(amount)}
    </Text>
  )
}
