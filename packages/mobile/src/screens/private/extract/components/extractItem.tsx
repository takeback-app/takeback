import React, { useContext, useState } from 'react'
import { Circle, HStack, Pressable, Text, VStack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { ExtractDataContext } from '../../../../contexts/ExtractDataContext'
import { masks, dateFormatSimple, delay } from '../../../../utils'
import { PrivateRouteParam } from '../../../../@types/routes'
import { ExtractTransactionTypes } from '../../../../types/responseApi/ExtractTransactionTypes'
import { ActivityIndicator } from 'react-native'

type ExtractItemProps = ExtractTransactionTypes

const transactionIconByStatus = {
  Pendente: 'time-outline',
  Aprovada: 'checkmark-circle-outline',
  'Pago com takeback': 'checkmark-circle-outline',
  Aguardando: 'time-outline',
  'Cancelada pelo parceiro': 'close-circle-outline',
  'Cancelada pelo cliente': 'close-circle-outline',
  'Em processamento': 'time-outline',
  'Em atraso': 'time-outline',
  'Não paga pelo parceiro': 'close-circle-outline',
  'Gratificação Takeback': 'checkmark-circle-outline'
}

export function ExtractItem(props: ExtractItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { setExtractData } = useContext(ExtractDataContext)

  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  const backAmount =
    props.backAmount > 0 ? masks.maskCurrency(props.backAmount) : ''

  function handleAmount() {
    if (props.isTransfer) {
      if (props.isReceived) {
        return `+ ${masks.maskCurrency(props.value)}`
      }

      return `- ${masks.maskCurrency(props.value)}`
    }

    if (props.amountPayWithTakebackBalance > 0) {
      return `- ${masks.maskCurrency(props.amountPayWithTakebackBalance)}`
    }

    return `+ ${masks.maskCurrency(props.cashbackAmount)}`
  }

  function getColorFromStatus() {
    if (props.isTransfer) {
      return props.isReceived ? 'green.600' : 'red.400'
    }

    if (props.amountPayWithTakebackBalance > 0) {
      return 'red.400'
    }

    if (props.statusDescription === 'Pendente') {
      return 'amber.500'
    }

    return 'green.600'
  }

  function handleTitle() {
    if (props.amountPayWithTakebackBalance > 0) {
      return 'Compra paga'
    }

    if (props.cashbackAmount > 0) {
      return 'Cashback recebido'
    }

    if (props.isTransfer) {
      if (props.isReceived) {
        return 'Transferência recebida'
      }

      return 'Transferência enviada'
    }
  }

  function handleIconName() {
    if (props.isTransfer) {
      if (props.isReceived) {
        return 'md-arrow-redo-outline'
      }

      return 'md-arrow-undo-outline'
    }

    if (props.amountPayWithTakebackBalance > 0) {
      return 'ios-cart-outline'
    }

    if (props.cashbackAmount > 0) {
      return 'wallet-outline'
    }
  }

  function handleName() {
    if (props.isTransfer) {
      return props.isReceived
        ? props.consumerSentName
        : props.consumerReceivedName
    }

    return props.fantasyName
  }

  async function navigateToDetails() {
    setIsLoading(true)
    setExtractData(props)
    await delay(750)
    navigation.navigate('extractDetails')
    await delay(750)
    setIsLoading(false)
  }

  return (
    <Pressable onPress={navigateToDetails}>
      <HStack p="4" space="4" bgColor="white">
        <Circle w="12" h="12" rounded="full" bgColor="gray.300">
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Ionicons name={handleIconName()} size={24} color="black" />
          )}
        </Circle>

        <VStack flex="1">
          <Text
            fontWeight="semibold"
            fontSize="md"
            color="gray.800"
            lineHeight="xs"
            mb="1"
          >
            {handleTitle()}
          </Text>
          <Text
            fontWeight="normal"
            fontSize="xs"
            color="gray.600"
            textTransform="capitalize"
            lineHeight="xs"
            numberOfLines={2}
          >
            <Ionicons
              name={props.isTransfer ? 'person-outline' : 'business-outline'}
              size={11}
              color="#838383"
            />{' '}
            {handleName()}
          </Text>
          {!props.isTransfer && (
            <Text
              fontWeight="normal"
              fontSize="xs"
              color="gray.600"
              lineHeight="xs"
              numberOfLines={2}
            >
              <Ionicons
                name={transactionIconByStatus[props.statusDescription]}
                size={12}
                color="#838383"
              />{' '}
              {props.statusDescription}
            </Text>
          )}
          <Text
            fontWeight="semibold"
            fontSize="md"
            color={getColorFromStatus()}
            mt="2"
          >
            {handleAmount()}
          </Text>
          {backAmount && (
            <Text fontWeight="semibold" fontSize="md" color="green.600">
              + {backAmount} (Troco)
            </Text>
          )}
        </VStack>

        <Text fontWeight="medium" fontSize="xs" color="gray.600">
          {dateFormatSimple(props.createdAt).toUpperCase()}
        </Text>
      </HStack>
    </Pressable>
  )
}
