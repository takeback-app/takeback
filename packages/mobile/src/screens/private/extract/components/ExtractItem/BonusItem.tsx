import React from 'react'

import { Ionicons } from '@expo/vector-icons'
import { Circle, Flex, HStack, Text, VStack } from 'native-base'

import { dateFormatSimple, masks } from '../../../../../utils'
import { BonusData, BonusType } from '../../types'

type BonusItemProps = BonusData & {
  referenceDate: string
}

const titleByType: { [key in BonusType]: string } = {
  SELL: 'Gratificação por venda',
  NEW_USER: 'Gratificação por novo usuário'
}

const textByType: { [key in BonusType]: string } = {
  SELL: 'Você também ganha quando emite cashback para seus clientes. Aproveite!',
  NEW_USER:
    'Um novo usuário entrou na Takeback vindo por você. Aproveite sua gratificação!'
}

export function BonusItem(props: BonusItemProps) {
  return (
    <Flex>
      <HStack p="4" space="4" bgColor="white">
        <Circle w="12" h="12" rounded="full" bgColor="gray.300">
          <Ionicons name="md-gift-outline" size={24} color="black" />
        </Circle>

        <VStack flex="1">
          <Text
            fontWeight="semibold"
            fontSize="md"
            color="gray.800"
            lineHeight="xs"
            mb="1"
          >
            {titleByType[props.type]}
          </Text>
          <Text
            fontWeight="normal"
            fontSize="xs"
            color="gray.600"
            lineHeight="xs"
            numberOfLines={2}
          >
            {textByType[props.type]}
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
    <Text fontWeight="semibold" fontSize="md" color="green.500">
      + {masks.maskCurrency(amount)}
    </Text>
  )
}
