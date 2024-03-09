import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {
  Flex,
  HStack,
  Icon,
  Pressable,
  Skeleton,
  Stack,
  Text,
  VStack
} from 'native-base'
import React from 'react'
import { View } from 'react-native'

import { PrivateRouteParam } from '../../../../../@types/routes'

interface HeaderComponentProps {
  imageURI?: string
  userName?: string
  notifications?: number
  isLoading?: boolean
  navigateToProfile?: () => void
  navigateToNotifications?: () => void
}

export const HeaderComponent: React.FC<HeaderComponentProps> = props => {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  function getFirstAndSecondName(name?: string) {
    if (!name) return 'User Name'

    const [firstName, secondName] = name.split(' ')

    if (firstName.length + secondName?.length >= 18) return firstName

    return `${firstName} ${secondName ? secondName : ''}`
  }

  function navigateToProfile() {
    navigation.navigate('profile')
  }

  function navigateToNotifications() {
    navigation.navigate('notifications')
  }

  if (props.isLoading) {
    return (
      <HStack alignItems="center" space="2" h="12">
        <Skeleton h="12" w="12" rounded="full" startColor="blue.400" />
        <VStack h="full" justifyContent="center" space="2">
          <Skeleton w="8" h="3" rounded="full" />
          <Skeleton w="32" h="3" rounded="full" />
        </VStack>
      </HStack>
    )
  }

  return (
    <HStack justifyContent="space-between" alignItems="center">
      <Pressable onPress={navigateToProfile}>
        <HStack space="4">
          <Flex
            w="12"
            h="12"
            rounded="full"
            justifyContent="center"
            alignItems="center"
            bg="blue.600"
            _text={{
              fontWeight: 'semibold',
              color: 'white'
            }}
          >
            <Icon as={Ionicons} name="person-outline" size="md" color="white" />
          </Flex>
          <View>
            <Text fontWeight="medium" fontSize="sm" color="gray.800">
              Olá,
            </Text>
            <Text
              fontWeight="semibold"
              fontSize="md"
              color="gray.800"
              textTransform="capitalize"
            >
              {getFirstAndSecondName(props.userName)}{' '}
              <Icon
                as={Ionicons}
                name="chevron-forward"
                size="md"
                color="gray.800"
              />
            </Text>
          </View>
        </HStack>
      </Pressable>

      <Pressable position="relative" onPress={navigateToNotifications}>
        <Icon
          as={Ionicons}
          name="notifications-outline"
          size="xl"
          color="gray.800"
        />
        {!!props.notifications && (
          <Stack
            w="17px"
            h="17px"
            position="absolute"
            top="-6px"
            right="-4px"
            justifyContent="center"
            alignItems="center"
            bgColor="red.400"
            rounded="full"
          >
            <Text
              fontSize={props?.notifications >= 10 ? '8px' : '11px'}
              fontWeight="bold"
              color="white"
            >
              {props?.notifications > 99 ? '+99' : props?.notifications}
            </Text>
          </Stack>
        )}
      </Pressable>
    </HStack>
  )
}
