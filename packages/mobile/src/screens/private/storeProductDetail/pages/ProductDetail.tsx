import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { Decimal } from 'decimal.js'
import { StatusBar } from 'expo-status-bar'
import {
  Button,
  Flex,
  HStack,
  ScrollView,
  Stack,
  Text,
  View,
  useToken
} from 'native-base'
import React, { useContext, useMemo, useState } from 'react'
import { ActivityIndicator, Text as NativeText } from 'react-native'

import useSWR from 'swr'

import { AnimatedImageBox } from '../../../../components/AnimatedImageBox'
import { BottomCard } from '../../../../components/BottomCard'
import { CloseBackButton } from '../../../../components/CloseBackButton'
import { NumberInput } from '../../../../components/input/NumberInput'
import { UserDataContext } from '../../../../contexts/UserDataContext'
import { onlyDateFormat } from '../../../../utils/DateFormat'
import { maskCurrency } from '../../../../utils/masks'
import { useBuyProduct } from '../state'
import { Product } from '../types'

export function ProductDetail({ route, navigation }) {
  const id = route.params?.id

  const { balance } = useContext(UserDataContext)

  const { setProduct, setQuantity: setBuyQuantity } = useBuyProduct()

  const [green600, red600, gray700] = useToken('colors', [
    'green.600',
    'red.600',
    'gray.700'
  ])

  const [quantity, setQuantity] = useState(0)

  const { data: product, isLoading } = useSWR<Product>(
    `costumer/store/products/${id}`
  )

  const stockColor = useMemo(() => {
    if (!product) return gray700

    if (product.stock <= 0) return red600

    return green600
  }, [product, gray700, red600, green600])

  const error = useMemo(() => {
    if (!product) return null

    const decimalBalance = new Decimal(balance)
    const decimalBuyValue = new Decimal(
      quantity * parseFloat(product.sellPrice)
    )

    if (decimalBuyValue.lessThanOrEqualTo(decimalBalance)) {
      return null
    }

    return 'Você não tem saldo suficiente para essa compra'
  }, [balance, product, quantity])

  const maxBuyQuantity = useMemo(() => {
    if (!product) return 0

    if (product.alreadyBoughtQuantity) {
      return product.maxBuyPerConsumer - product.alreadyBoughtQuantity
    }

    return Math.min(product.maxBuyPerConsumer, product.stock)
  }, [product])

  function handleBuy() {
    if (!product) return

    setProduct(product.id)
    setBuyQuantity(quantity)

    navigation.navigate('passwordConfirmation', {
      nextRoute: 'storePurchaseConfirmation'
    })
  }

  if (isLoading || !product) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="light" />

      <ScrollView bg="white" bounces={false}>
        <AnimatedImageBox uri={product.imageUrl} />
        <Stack py={4} px={6} space={4}>
          <Flex direction="row" align="center" justify="space-between">
            <HStack alignItems="center">
              <MaterialCommunityIcons name="calendar" size={16} />
              <Text ml={2} fontSize="xs" fontWeight="medium">
                Disponível até {onlyDateFormat(product.dateLimit)}
              </Text>
            </HStack>
          </Flex>

          <Stack space={2}>
            <Flex>
              <Text fontSize="lg" fontWeight="semibold">
                {product.name}
              </Text>
              <Text
                fontSize="xs"
                allowFontScaling={false}
                color="gray.700"
                fontWeight="medium"
              >
                ({product.unit})
              </Text>
            </Flex>

            <Flex>
              <Text
                textDecorationLine="line-through"
                textDecorationColor="gray.600"
                color={'gray.600'}
                fontWeight="medium"
              >
                {maskCurrency(Number(product.defaultPrice))}
              </Text>
              <Text
                lineHeight="md"
                color={'gray.800'}
                fontSize="3xl"
                fontWeight="bold"
              >
                {maskCurrency(Number(product.sellPrice))}
                <Text fontSize="lg"> cada</Text>
              </Text>
            </Flex>
          </Stack>

          <Stack space={2}>
            <HStack alignItems="center" space={2}>
              <Feather name="box" size={16} color={stockColor} />
              <Text fontWeight="medium" fontSize="xs" color={stockColor}>
                Estoque: {product.stock} itens
              </Text>
            </HStack>

            <HStack alignItems="center" space={2}>
              <Feather name="info" size={16} color={gray700} />
              <Text color={gray700} fontSize="xs" fontWeight="medium">
                Limitado a {product.maxBuyPerConsumer} itens por cliente{' '}
                {!!product.alreadyBoughtQuantity &&
                  `(já comprado ${product.alreadyBoughtQuantity})`}
              </Text>
            </HStack>
          </Stack>

          <NativeText allowFontScaling={false}>
            <Text fontSize="xs">Comprando esse produto você tem até dia</Text>{' '}
            <Text fontWeight="bold" fontSize="xs">
              {new Date(product.dateLimitWithdrawal).toLocaleDateString()}
            </Text>{' '}
            <Text fontSize="xs">para retirar no(a)</Text>{' '}
            <Text fontWeight="bold" fontSize="xs">
              {product.company.fantasyName.toUpperCase()}
            </Text>
            {'. '}
            <Text fontSize="xs">
              Passado dessa data você não poderá mais receber o produto e
              perderá o valor pago.
            </Text>
          </NativeText>

          <NumberInput
            number={quantity}
            setNumber={setQuantity}
            min={0}
            max={maxBuyQuantity}
          />
          {!!error && (
            <Text
              fontWeight="medium"
              color="red.600"
              fontSize="xs"
              allowFontScaling={false}
            >
              *{error}. Seu saldo: {maskCurrency(balance)}
            </Text>
          )}
        </Stack>
      </ScrollView>

      <BottomCard>
        <HStack justifyContent="space-between">
          <Stack>
            <Text fontSize="xs" fontWeight="medium">
              Total
            </Text>
            <Text
              lineHeight="sm"
              fontSize="lg"
              fontWeight="bold"
              color="blue.700"
            >
              {maskCurrency(quantity * Number(product.sellPrice))}
            </Text>
          </Stack>

          <Button
            onPress={handleBuy}
            isDisabled={!!error || !quantity}
            colorScheme="blue"
            rounded="full"
            _text={{
              fontSize: 'sm',
              fontWeight: 'semibold'
            }}
          >
            Comprar
          </Button>
        </HStack>
      </BottomCard>

      <CloseBackButton onPress={navigation.goBack} />
    </>
  )
}
