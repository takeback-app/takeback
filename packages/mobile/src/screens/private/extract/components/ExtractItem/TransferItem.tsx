import React from 'react'

import { Circle, Flex, HStack, Text, VStack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

import { TransferData } from '../../types'
import { dateFormatSimple, masks } from '../../../../../utils'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { PrivateRouteParam } from '../../../../../@types/routes'

type TransactionItemProps = TransferData & {
  referenceDate: string
}

export function TransferItem(props: TransactionItemProps) {
  const { amount, consumerName, isReceived, referenceDate, id } = props

  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('transferDetails', { id })}
    >
      <HStack p="4" space="4" bgColor="white">
        <Circle w="12" h="12" rounded="full" bgColor="gray.300">
          <Ionicons
            name={
              isReceived ? 'md-arrow-redo-outline' : 'md-arrow-undo-outline'
            }
            size={24}
            color="black"
          />
        </Circle>

        <VStack flex="1">
          <Text
            fontWeight="semibold"
            fontSize="md"
            color="gray.800"
            lineHeight="xs"
            mb="1"
          >
            {isReceived ? 'Transferência recebida' : 'Transferência enviada'}
          </Text>
          <Text
            fontWeight="normal"
            fontSize="xs"
            color="gray.600"
            textTransform="capitalize"
            lineHeight="xs"
            numberOfLines={2}
          >
            <Ionicons name={'person-outline'} size={11} color="#838383" />{' '}
            {consumerName}
          </Text>

          <Flex mt={2}>
            <TransferValueText amount={amount} isReceived={isReceived} />
          </Flex>
        </VStack>

        <Text fontWeight="medium" fontSize="xs" color="gray.600">
          {dateFormatSimple(referenceDate).toUpperCase()}
        </Text>
      </HStack>
    </TouchableOpacity>
  )
}

interface TransferValueTextProps {
  amount: number
  isReceived: boolean
}

function TransferValueText({ amount, isReceived }: TransferValueTextProps) {
  if (!amount) {
    return null
  }

  return (
    <Text
      fontWeight="semibold"
      fontSize="md"
      color={isReceived ? 'green.500' : 'red.400'}
    >
      {isReceived ? '+' : '-'} {masks.maskCurrency(amount)}
    </Text>
  )
}
