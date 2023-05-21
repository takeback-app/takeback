import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import {
  Box,
  Flex,
  HStack,
  Pressable,
  ScrollView,
  Stack,
  Text,
  View
} from 'native-base'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text as NativeText,
  Platform
} from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import useSWR from 'swr'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Raffle } from '../types'
import { maskCurrency } from '../../../../utils/masks'
import { UserDataContext } from '../../../../contexts/UserDataContext'
import { RaffleItem } from '../components/RaffleItem'
import { useDeliveryStore } from '../state'
import { onlyDateFormat } from '../../../../utils/DateFormat'

const screenWidth = Dimensions.get('window').width

const alreadyDrawStatusDescriptions = [
  'Finalizado',
  'Entrega dos prêmios',
  'Finalizado com pendencias'
]

export function RaffleDetail({ route, navigation }) {
  const { userData } = useContext(UserDataContext)
  const setRaffleItem = useDeliveryStore(state => state.setRaffleItem)

  const id = route.params?.id

  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()

  const animatedImageWeight = useSharedValue(300)
  const imageOpacity = useSharedValue(0)

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1)
  }

  const style = useAnimatedStyle(() => {
    return {
      width: '100%',
      height: withTiming(animatedImageWeight.value, config),
      opacity: withTiming(imageOpacity.value, { ...config, duration: 750 })
    }
  })

  const [imageHeight, setImageHeight] = useState(0)
  const [isImageExpanded, setIsImageExpanded] = useState(false)

  const { data: raffle, isLoading } = useSWR<Raffle>(
    `costumer/raffles/${id}/show`
  )

  const isAlreadyDraw = useMemo(() => {
    if (!raffle) return false

    return alreadyDrawStatusDescriptions.includes(raffle?.status.description)
  }, [raffle])

  const isWinner = useMemo(() => {
    if (!raffle) return false

    const winners = raffle.items.map(i => i.winnerTicket?.consumer.cpf)

    return winners.includes(userData.cpf)
  }, [raffle, userData])

  function onPressItem(id: string) {
    setRaffleItem(id)

    navigation.navigate('passwordConfirmation')
  }

  useEffect(() => {
    if (!raffle) return

    Image.getSize(raffle.imageUrl, (w, h) => {
      const height = (h * screenWidth) / w
      setImageHeight(height)
    })
  }, [raffle, imageHeight])

  if (isLoading || !raffle) {
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
        <Pressable
          position="relative"
          bg="gray.300"
          justifyContent="center"
          onPress={() => {
            if (!imageHeight) return

            animatedImageWeight.value = isImageExpanded ? 300 : imageHeight

            setIsImageExpanded(state => !state)
          }}
        >
          <ActivityIndicator
            style={{
              position: 'absolute',
              alignSelf: 'center',
              display: imageOpacity.value ? 'none' : 'flex'
            }}
            size="large"
          />
          <Animated.Image
            onLoadEnd={() => {
              imageOpacity.value = 1
            }}
            source={{ uri: raffle.imageUrl }}
            style={style}
          />
          <Box
            position="absolute"
            bg="white"
            bottom={4}
            p={1}
            rounded="full"
            alignSelf="center"
          >
            {isImageExpanded ? (
              <MaterialCommunityIcons name="chevron-up" size={16} />
            ) : (
              <MaterialCommunityIcons name="chevron-down" size={16} />
            )}
          </Box>
        </Pressable>
        <Stack flex={1} padding={4} space={4}>
          <Flex direction="row" align="center" justify="space-between">
            <HStack>
              <MaterialCommunityIcons name="calendar" size={20} />
              <Text ml={2} fontWeight="medium">
                {isAlreadyDraw ? 'Sorteado em' : 'Sorteio em'}:{' '}
                {onlyDateFormat(raffle.drawDate)}
              </Text>
            </HStack>
          </Flex>
          <Text fontSize="xl" fontWeight="semibold">
            {raffle.title}
          </Text>

          <Flex flexDir="row" align="center">
            <MaterialCommunityIcons
              name="office-building-marker-outline"
              size={16}
            />
            <Text ml={1.5} numberOfLines={1}>
              {raffle.company.fantasyName} -{' '}
              {raffle.company.companyAddress.city.name}
            </Text>
          </Flex>

          {raffle.isOpenToOtherCompanies && (
            <Text>
              Sorteio aberto: comprando em qualquer empresa da cidade você ganha
              cupom
            </Text>
          )}

          <Flex flexDirection="row" align="center" justify="space-between">
            {isAlreadyDraw ? (
              <Text
                color={isWinner ? 'green.600' : 'orange.500'}
                fontSize={isWinner ? 'xl' : 'lg'}
                lineHeight="sm"
                maxW="60%"
                fontWeight="bold"
              >
                {isWinner ? 'Você ganhou!' : 'Infelizmente não foi dessa vez.'}
              </Text>
            ) : (
              <Text
                color={isWinner ? 'green.600' : 'gray.800'}
                fontSize="md"
                lineHeight="sm"
                maxW="60%"
                fontWeight="medium"
              >
                A cada {maskCurrency(Number(raffle.ticketValue))} em compras
                você ganha um cupom
              </Text>
            )}

            <Flex flexDirection="row" align="center">
              <MaterialCommunityIcons name="ticket-percent-outline" size={20} />
              <Text ml={1.5} fontWeight="bold">
                {`${raffle._count.tickets} cupons`}
              </Text>
            </Flex>
          </Flex>

          <Stack mt={4} space={2} mb={bottomHeight}>
            <Flex>
              <Text fontSize="xl" fontWeight="bold">
                Prêmios
              </Text>
              {isWinner ? (
                <Text fontSize="xs" fontWeight="medium" color="gray.500">
                  Clique no seu prêmio para poder confirmar a entrega
                </Text>
              ) : null}
            </Flex>
            <NativeText style={{ marginTop: isWinner ? 4 : 0 }}>
              <Text fontSize="xs">Local de retirada: </Text>
              <Text fontWeight="bold" fontSize="xs">
                {raffle.pickUpLocation || 'Nenhum local informado.'}{' '}
              </Text>
              <Text fontSize="xs">
                (A retirada dos prêmios é por conta do cliente)
              </Text>
            </NativeText>

            {raffle.items.map(item => (
              <RaffleItem
                key={item.id}
                item={item}
                isOpenToOtherCompanies={raffle.isOpenToOtherCompanies}
                userCpf={userData.cpf}
                onPress={onPressItem}
              />
            ))}
          </Stack>
        </Stack>
      </ScrollView>

      <Pressable
        onPress={() => navigation.goBack()}
        position="absolute"
        style={{ top: Platform.OS === 'ios' ? 8 : topHeight }}
        right={2}
        p={2}
      >
        <View bg="white" rounded="full" p={1.5}>
          <MaterialCommunityIcons name="close" size={24} />
        </View>
      </Pressable>
    </>
  )
}
