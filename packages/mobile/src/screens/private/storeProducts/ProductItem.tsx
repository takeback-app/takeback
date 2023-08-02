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
import { Product } from '../storeProductDetail/types'
import moment from 'moment'

export const numColumns = 2
export const gap = 12

const screenWidth = Dimensions.get('window').width

const availableSpace = screenWidth - (numColumns - 1) * gap
const itemSize = (availableSpace - gap) / numColumns

export function ProductItem({ product }: { product: Product }) {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  const dateInfo = useMemo(() => {
    const dateFormatted = getFormattedDate(product.dateLimit)

    return {
      dateFormatted,
      isClose: /(hora|minuto)/i.test(dateFormatted)
    }
  }, [product])

  const isExpired = useMemo(
    () => moment(product.dateLimitWithdrawal).isBefore(new Date()),
    [product]
  )

  function handlePress() {
    if (isExpired || !product.stock) return

    navigation.navigate('productDetail', { id: product.id })
  }

  function renderTag() {
    if (!product.stock) {
      return (
        <ProductItemTag bg={'red.500'} iconName="archive-cancel">
          Fora de estoque
        </ProductItemTag>
      )
    }

    if (dateInfo.dateFormatted) {
      return (
        <ProductItemTag
          bg={dateInfo.isClose ? 'red.500' : 'blue.600'}
          iconName="clock"
        >
          {dateInfo.dateFormatted}
        </ProductItemTag>
      )
    }

    return null
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
          source={{ uri: product.imageUrl }}
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
            {product.name}
          </Text>
          <Flex>
            <Text
              textDecorationLine="line-through"
              textDecorationColor="gray.600"
              fontSize="xs"
              color={'gray.600'}
              fontWeight="medium"
            >
              {maskCurrency(Number(product.defaultPrice))}
            </Text>
            <Text
              fontWeight="bold"
              fontSize="xl"
              color="blue.800"
              numberOfLines={2}
              lineHeight="xs"
              mb={2}
            >
              {maskCurrency(Number(product.sellPrice))}
            </Text>
          </Flex>
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
            {product.company.fantasyName}
          </Text>
          {/* <Text
            fontWeight={product._count?.tickets ? 'semibold' : 'medium'}
            fontSize="xs"
            lineHeight="xs"
            color={product._count?.tickets ? 'success.600' : 'gray.600'}
          >
            <MaterialCommunityIcons name="ticket-percent-outline" size={13} />{' '}
            {product._count?.tickets
              ? `Você tem ${product._count.tickets} cupons`
              : 'Ainda sem cupons'}
          </Text> */}
        </Flex>
        {renderTag()}
      </Flex>
    </TouchableOpacity>
  )
}
