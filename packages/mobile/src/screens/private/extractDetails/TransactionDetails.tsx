import React, { useMemo } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import {
  Box,
  Center,
  Flex,
  HStack,
  Pressable,
  ScrollView,
  Text,
  VStack,
  View
} from 'native-base'
import useSWR from 'swr'

import { dateFormat, getInitials, masks } from '../../../utils'
import { colors } from './utils'
import { percentageFormatter } from '../../../utils/masks'
import { ActivityIndicator, Platform } from 'react-native'
import { Transaction } from './types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function TransactionDetails({ route, navigation }) {
  const id = route.params?.id

  const { top: topHeight } = useSafeAreaInsets()

  const { data: transaction, isLoading } = useSWR<Transaction>(
    `costumer/extract/transactions/${id}`
  )

  const isOnlyPayment = useMemo(() => {
    if (!transaction) return false
    return (
      !!Number(transaction?.amountPayWithTakebackBalance) &&
      !Number(transaction?.cashbackAmount)
    )
  }, [transaction])

  if (isLoading || !transaction) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <>
      <ScrollView bg="white" bounces={false}>
        <Center p="4" pt={8}>
          <Flex
            justifyContent="center"
            alignItems="center"
            w="24"
            h="24"
            rounded="full"
            bgColor="gray.400"
          >
            <Text fontWeight="semibold" fontSize="2xl" color="gray.800">
              {getInitials(transaction.company.fantasyName)}
            </Text>
          </Flex>

          <Text
            fontWeight="semibold"
            fontSize="xl"
            color="gray.800"
            textTransform="uppercase"
            textAlign="center"
            numberOfLines={2}
            mt="4"
          >
            {transaction.company.fantasyName}
          </Text>
          <Text
            fontWeight="medium"
            fontSize="sm"
            color="gray.600"
            textTransform="uppercase"
            textAlign="center"
          >
            {isOnlyPayment ? 'Compra paga' : 'Cashback recebido'}
          </Text>
          <Text
            fontWeight="medium"
            fontSize="sm"
            color="gray.600"
            textAlign="center"
          >
            {dateFormat(transaction.createdAt)}
          </Text>
          <Flex mt="12">
            <CashbackText amount={+transaction.cashbackAmount} />
            <TakebackPayText
              amount={+transaction.amountPayWithTakebackBalance}
              hasAdditionalText={!isOnlyPayment}
            />
            <BackAmountText amount={+transaction.backAmount} />
          </Flex>

          <Box
            bgColor={colors[transaction.transactionStatus.id || 3]}
            px="4"
            py="2"
            rounded="lg"
            mt="4"
          >
            <Text
              fontWeight="medium"
              fontSize="sm"
              color="white"
              textTransform="uppercase"
            >
              {transaction.transactionStatus.description}
            </Text>
          </Box>
        </Center>

        <VStack bgColor="white" mt="12" p="4" space="2">
          <Text fontWeight="medium" fontSize="xl" color="gray.800">
            Detalhes
          </Text>
          <HStack justifyContent="space-between" space="2">
            <VStack
              flex="1"
              p="4"
              borderWidth="1"
              justifyContent="space-between"
              borderColor="gray.400"
              rounded="xl"
            >
              <Text
                fontWeight="medium"
                fontSize={fontSizeFromValue(+transaction.totalAmount)}
                color="gray.800"
                textTransform="capitalize"
                noOfLines={1}
              >
                {masks.maskCurrency(+transaction.totalAmount)}
              </Text>
              <Text
                fontWeight="medium"
                fontSize="xs"
                lineHeight="xs"
                maxW="75%"
                color="gray.600"
              >
                Valor total da compra
              </Text>
            </VStack>

            <VStack
              flex="1"
              p="4"
              borderWidth="1"
              justifyContent="space-between"
              borderColor="gray.400"
              rounded="xl"
            >
              <Text
                fontWeight="medium"
                fontSize="2xl"
                color="gray.800"
                textTransform="capitalize"
              >
                {percentageFormatter(transaction.cashbackPercent)}
              </Text>
              <Text
                fontWeight="medium"
                fontSize="xs"
                lineHeight="xs"
                maxW={100}
                color="gray.600"
              >
                Percentual de cashback
              </Text>
            </VStack>
          </HStack>

          {transaction.transactionPaymentMethods.map(item => (
            <VStack
              p="4"
              borderWidth="1"
              borderColor="gray.400"
              rounded="xl"
              key={item.id}
            >
              <Text fontWeight="semibold" fontSize="14" color="gray.800">
                {item.companyPaymentMethod.paymentMethod.description} (
                {percentageFormatter(item.cashbackPercentage)} de volta)
              </Text>
              <Text fontWeight="medium" fontSize="sm" color="gray.600">
                {masks.maskCurrency(parseFloat(item.cashbackValue))}
                {' de '}

                {item.companyPaymentMethod.paymentMethod.description ===
                'Takeback'
                  ? masks.maskCurrency(
                      Number(transaction.amountPayWithTakebackBalance)
                    )
                  : masks.maskCurrency(
                      calculateDetailReferenceValue(
                        item.cashbackValue,
                        item.cashbackPercentage
                      )
                    )}
                {}
              </Text>
            </VStack>
          ))}
        </VStack>
      </ScrollView>
      <Pressable
        position="absolute"
        left={4}
        style={{ top: Platform.OS === 'ios' ? 16 : topHeight + 16 }}
        onPress={navigation.goBack}
      >
        <MaterialCommunityIcons name="close" color="#52525b" size={24} />
      </Pressable>
    </>
  )
}

interface CashbackTextProps {
  amount: number
}

interface TakebackPayTextProps {
  amount: number
  hasAdditionalText: boolean
}

interface BackAmountTextProps {
  amount: number
}

function CashbackText({ amount }: CashbackTextProps) {
  if (!amount) {
    return null
  }

  return (
    <Text
      fontWeight="semibold"
      fontSize="3xl"
      color="gray.800"
      textAlign="center"
    >
      + {masks.maskCurrency(amount)}
    </Text>
  )
}

function BackAmountText({ amount }: BackAmountTextProps) {
  if (!amount) {
    return null
  }

  return (
    <Text fontWeight="medium" fontSize="lg" color="gray.800" textAlign="center">
      + {masks.maskCurrency(amount)} (Troco)
    </Text>
  )
}

function TakebackPayText({ amount, hasAdditionalText }: TakebackPayTextProps) {
  if (!amount) {
    return null
  }

  if (hasAdditionalText) {
    return (
      <Text
        fontWeight="medium"
        fontSize="lg"
        textAlign="center"
        color="red.400"
      >
        - {masks.maskCurrency(amount)}{' '}
        {hasAdditionalText ? '(Pago com Takeback)' : null}
      </Text>
    )
  }

  return (
    <Text
      fontWeight="semibold"
      fontSize="3xl"
      color="gray.800"
      textAlign="center"
    >
      - {masks.maskCurrency(amount)}
    </Text>
  )
}

function calculateDetailReferenceValue(value, percentage) {
  value = parseFloat(value)

  percentage = parseFloat(percentage) * 100

  const result = (value * 100) / percentage // Regra de três

  return result || 0
}

function fontSizeFromValue(value: number) {
  switch (true) {
    case value > 100:
      return 'xl'
    case value > 10:
      return '2xl'
    default:
      return '3xl'
  }
}
