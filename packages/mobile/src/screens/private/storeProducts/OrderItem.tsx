import React, { useMemo } from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Flex, Text } from 'native-base'
import { Dimensions, TouchableOpacity } from 'react-native'

import { LoadingImage } from '../../../components/LoadingImage'
import { getFormattedDate, maskCurrency } from '../../../utils/masks'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { PrivateRouteParam } from '../../../@types/routes'
import { ProductItemTag } from './ProductItemTag'
import { Order, Product } from '../storeProductDetail/types'

export const numColumns = 2
export const gap = 12

const screenWidth = Dimensions.get('window').width

const availableSpace = screenWidth - (numColumns - 1) * gap
const itemSize = (availableSpace - gap) / numColumns

export function OrderItem({ order }: { order: Order }) {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  const dateInfo = useMemo(() => {
    const dateFormatted = getFormattedDate(order.product.dateLimitWithdrawal)

    return {
      dateFormatted,
      isClose: /(hora|minuto)/i.test(dateFormatted)
    }
  }, [order])

  function handlePress() {
    navigation.navigate('orderDetail', { id: order.id })
  }

  function renderTag() {
    if (order.withdrawalAt) {
      return (
        <ProductItemTag bg={'green.600'} iconName="archive-cancel">
          Pedido retirado
        </ProductItemTag>
      )
    }

    if (dateInfo.dateFormatted) {
      return (
        <ProductItemTag
          bg={dateInfo.isClose ? 'red.500' : 'orange.500'}
          iconName="clock"
        >
          {dateInfo.dateFormatted}
        </ProductItemTag>
      )
    }

    return (
      <ProductItemTag bg={'red.500'} iconName="clock">
        Expirado
      </ProductItemTag>
    )
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <Flex
        rounded="lg"
        bg="white"
        w={itemSize}
        h={itemSize}
        style={{ margin: gap / 2 }}
      >
        <LoadingImage
          source={{ uri: order.product.imageUrl }}
          style={{
            flex: 1,
            backgroundColor: '#e4e4e7',
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8
          }}
        />
        <Flex px={2} py={2}>
          <Text
            fontWeight="semibold"
            color="gray.700"
            numberOfLines={2}
            lineHeight="xs"
            mb={2}
          >
            {order.quantity}x {order.product.name}
          </Text>
          <Text
            fontWeight="bold"
            fontSize="lg"
            color="blue.800"
            numberOfLines={2}
            lineHeight="xs"
            mb={2}
          >
            {maskCurrency(Number(order.value))}
          </Text>
          <Text
            fontWeight="medium"
            fontSize="xs"
            color="gray.600"
            textTransform="capitalize"
            lineHeight="xs"
            numberOfLines={1}
            mb={1}
          >
            <MaterialCommunityIcons
              name="office-building-marker-outline"
              size={11}
            />{' '}
            {order.product.company.fantasyName}
          </Text>
        </Flex>
        {renderTag()}
      </Flex>
    </TouchableOpacity>
  )
}
