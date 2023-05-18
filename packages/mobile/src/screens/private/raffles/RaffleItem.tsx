import React, { useMemo } from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Flex, Text } from 'native-base'
import { Dimensions, TouchableOpacity } from 'react-native'

import { LoadingImage } from '../../../components/LoadingImage'
import { getFormattedDate } from '../../../utils/masks'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { PrivateRouteParam } from '../../../@types/routes'
import { RaffleItemTag } from './RaffleItemTag'

export const numColumns = 2
export const gap = 12

export interface Raffle {
  id: string
  title: string
  imageUrl: string
  drawDate: string

  company: {
    fantasyName: string
  }
  _count?: {
    items: number
    tickets: number
  }
}

const screenWidth = Dimensions.get('window').width

const availableSpace = screenWidth - (numColumns - 1) * gap
const itemSize = (availableSpace - gap) / numColumns

export function RaffleItem({ raffle }: { raffle: Raffle }) {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  const dateInfo = useMemo(() => {
    const dateFormatted = getFormattedDate(raffle.drawDate)

    return {
      dateFormatted,
      isClose: /(hora|minuto)/i.test(dateFormatted)
    }
  }, [raffle])

  function handlePress() {
    navigation.navigate('raffleDetail', { id: raffle.id })
  }

  function renderTag() {
    if (raffle._count?.items) {
      if (!raffle._count.items) return null

      return (
        <RaffleItemTag bg="green.500" iconName="heart">
          Você ganhou!
        </RaffleItemTag>
      )
    }

    if (dateInfo.dateFormatted) {
      return (
        <RaffleItemTag
          bg={dateInfo.isClose ? 'red.500' : 'blue.600'}
          iconName="clock"
        >
          {dateInfo.dateFormatted}
        </RaffleItemTag>
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
          source={raffle.imageUrl}
          style={{
            flex: 1,
            backgroundColor: '#e4e4e7',
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8
          }}
        />
        <Flex px={2} py={2}>
          <Text
            fontWeight="bold"
            color="gray.800"
            numberOfLines={2}
            lineHeight="xs"
            mb={2}
          >
            {raffle.title}
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
            {raffle.company.fantasyName}
          </Text>
          <Text
            fontWeight={raffle._count?.tickets ? 'semibold' : 'medium'}
            fontSize="xs"
            lineHeight="xs"
            color={raffle._count?.tickets ? 'success.600' : 'gray.600'}
          >
            <MaterialCommunityIcons name="ticket-percent-outline" size={13} />{' '}
            {raffle._count?.tickets
              ? `Você tem ${raffle._count.tickets} cupons`
              : 'Ainda sem cupons'}
          </Text>
        </Flex>
        {renderTag()}
      </Flex>
    </TouchableOpacity>
  )
}
