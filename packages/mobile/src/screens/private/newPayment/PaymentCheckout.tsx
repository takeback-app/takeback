import React, { useMemo, useState } from 'react'
import { Text as NativeText } from 'react-native'

import { Feather } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import {
  Button,
  Flex,
  HStack,
  Heading,
  Pressable,
  Stack,
  Text
} from 'native-base'

import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePaymentStore } from './state'
import { mask } from 'react-native-mask-text'
import { maskCurrency } from '../../../utils/masks'
import { AlertComponent } from '../../../components/alert'
import { createCashbackSolicitation } from '../../../services'

export function PaymentCheckout({ navigation }) {
  const { company, totalAmount, paymentMethodId } = usePaymentStore()
  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const address = useMemo(() => {
    if (!company?.companyAddress) return

    const { district, number, street } = company.companyAddress

    return [street, number, district].filter(i => i).join(', ')
  }, [company])

  async function generate() {
    const [isOk, generateData] = await createCashbackSolicitation({
      value: totalAmount,
      companyPaymentMethodId: paymentMethodId,
      companyId: company.id
    })

    if (!isOk) {
      return setError(generateData.message)
    }

    navigation.navigate('paymentConfirmation')
  }

  async function handleConfirmation() {
    setIsLoading(true)

    await generate()

    setIsLoading(false)
  }

  return (
    <Flex flex={1} bg="white">
      <StatusBar style="auto" />
      <HStack
        p={4}
        style={{ marginTop: Platform.OS === 'ios' ? 0 : topHeight }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" color="#52525b" size={24} />
        </Pressable>
      </HStack>

      <Flex px={4} mt={2}>
        <Heading fontSize="26" fontWeight="semibold">
          Revise os detalhes da sua compra
        </Heading>
        <NativeText style={{ marginTop: 8 }}>
          <Text fontSize="16px" color="gray.800">
            para{' '}
          </Text>
          <Text fontSize="16px" textTransform="uppercase" fontWeight="bold">
            {company.fantasyName}
          </Text>
        </NativeText>
      </Flex>
      <Flex mt={4}>
        <HStack px={4} py={4}>
          <Stack>
            <Text fontWeight="medium" color="gray.600" fontSize="14px">
              Forma de pagamento
            </Text>
            <Text mt={1} fontWeight="semibold" color="gray.800" fontSize="15px">
              {company.companyPaymentMethods.find(c => c.id === paymentMethodId)
                ?.paymentMethod.description ?? '-'}
            </Text>
          </Stack>
        </HStack>
        <Flex borderBottomWidth="1.5" borderColor="gray.300" />
      </Flex>
      <Stack mt={4}>
        {address ? (
          <Text
            color="gray.600"
            textAlign="center"
            textTransform="capitalize"
            fontWeight="medium"
          >
            {address}
          </Text>
        ) : null}
        <Text
          color="gray.600"
          textAlign="center"
          textTransform="lowercase"
          fontWeight="medium"
        >
          {company.email}
        </Text>

        <Text
          color="gray.600"
          textAlign="center"
          textTransform="lowercase"
          fontWeight="medium"
        >
          {mask(company.phone, '(99) 99999-9999')}
        </Text>
      </Stack>
      {error ? (
        <Flex mt="4">
          <AlertComponent
            status="warning"
            title="Aguarde"
            message={error}
            showAlert={!!error}
            closeAlert={() => setError('')}
          />
        </Flex>
      ) : null}

      <Flex
        flex={1}
        style={{ paddingBottom: bottomHeight + 24 }}
        justify="flex-end"
      >
        <HStack
          borderTopWidth="2"
          px={6}
          pt={6}
          borderTopColor="gray.300"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack>
            <Text fontWeight="semibold" fontSize="lg">
              {maskCurrency(totalAmount)}
            </Text>
            <Text color="gray.600" fontWeight="medium">
              Total a pagar
            </Text>
          </Stack>
          <Button
            px={6}
            py={3}
            colorScheme="blue"
            rounded="full"
            isLoading={isLoading}
            _text={{
              fontSize: 'md',
              fontWeight: 'semibold'
            }}
            onPress={handleConfirmation}
          >
            Solicitar
          </Button>
        </HStack>
      </Flex>
    </Flex>
  )
}
