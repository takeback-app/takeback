import React from 'react'
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
import { maskCurrency } from '../../../utils/masks'
import { useDepositStore } from './state'
import useSWR from 'swr'

const TAX_PERCENTAGE = 2

export function DepositCheckout({ navigation }) {
  const { totalAmount } = useDepositStore()
  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()

  const { data: depositConfig } = useSWR<{
    depositFeePercentage: string
    depositMaxDailyValue: string
    bankPixFeePercentage: string
  }>('costumer/transfer-config')

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
          Revise os detalhes do seu deposito
        </Heading>
        <NativeText allowFontScaling={false} style={{ marginTop: 8 }}>
          <Text fontSize="16px" color="gray.800">
            Valor será adicionado ao saldo
          </Text>
          {/* <Text fontSize="16px" textTransform="uppercase" fontWeight="bold">
            {company.fantasyName}
          </Text> */}
        </NativeText>
      </Flex>
      <Flex mt={4}>
        <HStack px={4} py={4}>
          <Stack>
            <Text fontWeight="medium" color="gray.600" fontSize="14px">
              Forma de pagamento
            </Text>
            <Text mt={1} fontWeight="semibold" color="gray.800" fontSize="15px">
              Pix
            </Text>
          </Stack>
        </HStack>
        <Flex borderBottomWidth="1.5" borderColor="gray.300" />
        <HStack px={4} py={4}>
          <Stack>
            <Text fontWeight="medium" color="gray.600" fontSize="14px">
              Taxa de operação
            </Text>
            <Text mt={1} fontWeight="semibold" color="gray.800" fontSize="15px">
              {Number(depositConfig?.depositFeePercentage)}%
            </Text>
          </Stack>
        </HStack>
        <Flex borderBottomWidth="1.5" borderColor="gray.300" />
        <HStack px={4} py={4}>
          <Stack>
            <Text fontWeight="medium" color="gray.600" fontSize="14px">
              Taxa do banco
            </Text>
            <Text mt={1} fontWeight="semibold" color="gray.800" fontSize="15px">
              {Number(depositConfig?.bankPixFeePercentage)}%
            </Text>
          </Stack>
        </HStack>
        <Flex borderBottomWidth="1.5" borderColor="gray.300" />
        <HStack px={4} py={4}>
          <Stack>
            <Text fontWeight="medium" color="gray.600" fontSize="14px">
              Total creditado
            </Text>
            <Text mt={1} fontWeight="semibold" color="gray.800" fontSize="15px">
              {maskCurrency(totalAmount)}
            </Text>
          </Stack>
        </HStack>
        <Flex borderBottomWidth="1.5" borderColor="gray.300" />
        <HStack px={4} py={4}>
          <Stack>
            <Text fontWeight="medium" color="gray.600" fontSize="14px">
              Total a pagar
            </Text>
            <Text mt={1} fontWeight="semibold" color="gray.800" fontSize="15px">
              {maskCurrency(
                (totalAmount *
                  (1 + Number(depositConfig?.depositFeePercentage) / 100)) /
                  (1 - Number(depositConfig?.bankPixFeePercentage) / 100)
              )}
            </Text>
          </Stack>
        </HStack>
        <Flex borderBottomWidth="1.5" borderColor="gray.300" />
      </Flex>

      <Flex
        flex={1}
        style={{ paddingBottom: bottomHeight + 24 }}
        justify="flex-end"
      >
        <HStack
          px={6}
          pt={6}
          borderTopColor="gray.300"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            px={6}
            py={3}
            colorScheme="blue"
            rounded="full"
            _text={{
              fontSize: 'md',
              fontWeight: 'semibold'
            }}
            onPress={() => navigation.navigate('depositPassword')}
          >
            Pagar
          </Button>
        </HStack>
      </Flex>
    </Flex>
  )
}
