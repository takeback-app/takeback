import React, { useMemo } from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { Center, Flex, HStack, Heading, Stack, Text } from 'native-base'
import { Platform, Pressable } from 'react-native'
import { usePaymentStore } from './state'

import Illustration from '../../../assets/illustration7.svg'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { masks } from '../../../utils'

export function PaymentConfirmation({ navigation }) {
  const { reset, company, paymentMethodId, totalAmount } = usePaymentStore()

  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()

  const paymentMethodDescription = useMemo(() => {
    const companyPaymentMethod = company.companyPaymentMethods.find(
      p => p.id === paymentMethodId
    )

    if (!companyPaymentMethod) return 'Dinheiro'

    return companyPaymentMethod.paymentMethod.description
  }, [company, paymentMethodId])

  function handleExit() {
    navigation.popToTop()
    navigation.goBack(null)
    reset()
  }

  return (
    <Flex flex={1} bg="white">
      <StatusBar style="auto" />
      <HStack
        p={4}
        style={{ marginTop: Platform.OS === 'ios' ? 0 : topHeight }}
      >
        <Pressable onPress={handleExit}>
          <MaterialCommunityIcons name="close" color="#52525b" size={24} />
        </Pressable>
      </HStack>

      <Stack
        flex="1"
        mb={bottomHeight}
        px="4"
        space="8"
        justifyContent="center"
      >
        <Center>
          <Illustration style={{ marginTop: -48 }} />
          <Heading
            fontSize="xl"
            color="gray.800"
            fontWeight="bold"
            textAlign="center"
            mt="8"
          >
            Seu cashback foi solicitado
          </Heading>
          <Text textAlign="center" color="gray.600" fontWeight="medium" mt="2">
            Agora só falta a empresa confirmar o seu cashback e seu saldo será
            atualizado.
          </Text>
        </Center>

        <Center
          borderStyle="dashed"
          borderWidth="1"
          borderColor="gray.400"
          rounded="md"
          py="8"
        >
          <Heading
            fontSize="3xl"
            color="gray.800"
            fontWeight="bold"
            textAlign="center"
          >
            {masks.maskCurrency(totalAmount)}
          </Heading>
          <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
            em{' '}
            <Text fontWeight="bold" color="gray.800" textTransform="capitalize">
              {paymentMethodDescription}
            </Text>
          </Text>
          <Text fontSize="md" color="gray.600" fontWeight="medium">
            para{' '}
            <Text fontWeight="bold" color="gray.800" textTransform="capitalize">
              {company.fantasyName}
            </Text>
          </Text>
          <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
            Agora mesmo
          </Text>
        </Center>
      </Stack>
    </Flex>
  )
}
