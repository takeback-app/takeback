import React from 'react'

import { Circle, Flex, HStack, Text, VStack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

import { TransactionData } from '../../types'
import { dateFormatSimple, masks } from '../../../../../utils'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { PrivateRouteParam } from '../../../../../@types/routes'

const transactionIconByStatus = {
  Pendente: 'time-outline',
  Aprovada: 'checkmark-circle-outline',
  'Pago com takeback': 'checkmark-circle-outline',
  Aguardando: 'time-outline',
  'Cancelada pelo parceiro': 'close-circle-outline',
  'Cancelada pelo cliente': 'close-circle-outline',
  'Em processamento': 'time-outline',
  'Em atraso': 'time-outline',
  'Não paga pelo parceiro': 'close-circle-outline'
}

type TransactionItemProps = TransactionData & {
  referenceDate: string
}

export function TransactionItem(props: TransactionItemProps) {
  const { amountPayWithTakebackBalance, cashbackAmount, companyName } = props

  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('transactionDetails', { id: props.id })
      }
    >
      <HStack p="4" space="4" bgColor="white">
        <Circle w="12" h="12" rounded="full" bgColor="gray.300">
          <Ionicons
            name={
              amountPayWithTakebackBalance > 0
                ? 'ios-cart-outline'
                : 'wallet-outline'
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
            {!!amountPayWithTakebackBalance && !cashbackAmount
              ? 'Compra paga'
              : ['Cancelada pelo parceiro', 'Cancelada pelo cliente'].includes(
                  props.status
                )
              ? 'Cashback cancelado'
              : 'Cashback recebido'}
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
              name={
                transactionIconByStatus[props.status] ??
                'checkmark-circle-outline'
              }
              size={12}
              color="#838383"
            />{' '}
            {props.status}
          </Text>

          <Flex mt={2}>
            <CashbackText amount={cashbackAmount} status={props.status} />
            <TakebackPayText
              amount={amountPayWithTakebackBalance}
              hasAdditionalText={
                !!amountPayWithTakebackBalance && !!cashbackAmount
              }
            />
            <BackAmountText amount={props.backAmount} />
          </Flex>
        </VStack>

        <Text fontWeight="medium" fontSize="xs" color="gray.600">
          {dateFormatSimple(props.referenceDate).toUpperCase()}
        </Text>
      </HStack>
    </TouchableOpacity>
  )
}

interface CashbackTextProps {
  amount: number
  status: string
}

interface TakebackPayTextProps {
  amount: number
  hasAdditionalText: boolean
}

interface BackAmountTextProps {
  amount: number
}

const statusColor = {
  Pendente: 'amber.500',
  Aprovada: 'green.500',
  'Pago com takeback': 'green.500',
  Aguardando: 'amber.500',
  'Cancelada pelo parceiro': 'black',
  'Cancelada pelo cliente': 'black',
  'Em processamento': 'amber.500',
  'Em atraso': 'amber.500',
  'Não paga pelo parceiro': 'black'
}

function CashbackText({ amount, status }: CashbackTextProps) {
  if (!amount) {
    return null
  }

  return (
    <Text fontWeight="semibold" fontSize="md" color={statusColor[status]}>
      + {masks.maskCurrency(amount)}
    </Text>
  )
}

function BackAmountText({ amount }: BackAmountTextProps) {
  if (!amount) {
    return null
  }

  return (
    <Text fontWeight="semibold" fontSize="md" color="green.600">
      + {masks.maskCurrency(amount)} (Troco)
    </Text>
  )
}

function TakebackPayText({ amount, hasAdditionalText }: TakebackPayTextProps) {
  if (!amount) {
    return null
  }

  return (
    <Text fontWeight="semibold" fontSize="md" color="red.400">
      - {masks.maskCurrency(amount)}{' '}
      {hasAdditionalText ? '(Pago com Takeback)' : null}
    </Text>
  )
}
