import React, { useCallback, useContext, useEffect, useState } from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { Center, Flex, HStack, Heading, Stack, Text } from 'native-base'
import { ActivityIndicator, Platform, Pressable } from 'react-native'
import { useBuyProduct } from '../state'

import Illustration from '../../../../assets/illustration7.svg'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStoreOrder } from '../../../../services'
import { masks } from '../../../../utils'
import { Order, ResponseError } from '../types'
import { UserDataContext } from '../../../../contexts/UserDataContext'

export function PurchaseConfirmation({ navigation }) {
  const { balance, userData, setUserData } = useContext(UserDataContext)
  const { productId, quantity, reset } = useBuyProduct()

  const [isLoading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order>()
  const [error, setError] = useState<string>()

  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()

  function handleExit() {
    navigation.popToTop()
    navigation.goBack(null)
    reset()
  }

  const generate = async () => {
    setLoading(true)

    setError(undefined)

    if (!productId || !quantity) {
      return setError('Existem problemas nos dados. Tente novamente.')
    }

    const [isOk, response] = await createStoreOrder<Order>({
      productId,
      quantity
    })

    if (!isOk) {
      const responseError = response as unknown as ResponseError

      setLoading(false)

      return setError(responseError.message)
    }

    setOrder(response)

    setUserData({
      ...userData,
      balance: balance - parseFloat(response.value)
    })

    setLoading(false)
  }

  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" />
      </Center>
    )
  }

  if (error) {
    return (
      <Flex flex={1} bg="white">
        <StatusBar style="auto" />
        <HStack
          p={4}
          justifyContent="flex-end"
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
              Sua compra negada
            </Heading>
            <Text
              textAlign="center"
              color="gray.600"
              fontWeight="medium"
              fontSize="md"
              mt={2}
            >
              {error}
            </Text>
          </Center>
        </Stack>
      </Flex>
    )
  }

  return (
    <Flex flex={1} bg="white">
      <StatusBar style="auto" />
      <HStack
        p={4}
        justifyContent="flex-end"
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
            Sua compra foi realizada
          </Heading>
          <Text textAlign="center" color="gray.600" fontWeight="medium" mt="2">
            Agora só falta você retirar seu produto na empresa.
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
            {masks.maskCurrency(Number(order?.value))}
          </Heading>
          <Stack alignItems="center" justifyContent="center" space={1}>
            <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
              na compra de{' '}
            </Text>
            <Text fontWeight="bold" color="gray.800" textTransform="capitalize">
              {order?.quantity}x {order?.product.name}
            </Text>
            <Text fontSize="md" color="gray.600" fontWeight="medium">
              retirar no(a){' '}
              <Text
                fontWeight="bold"
                color="gray.800"
                textTransform="capitalize"
              >
                {order?.product.company.fantasyName}
              </Text>
            </Text>
          </Stack>

          {/* <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
            Agora mesmo
          </Text> */}
        </Center>
      </Stack>
    </Flex>
  )
}
