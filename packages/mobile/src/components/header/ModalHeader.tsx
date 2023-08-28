import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { HStack, Pressable, Text } from 'native-base'
import React from 'react'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
  onPress: () => void
  type?: 'close' | 'back'
  title: string
  rightElement?: React.ReactNode
}

export function ModalHeader({
  onPress,
  title,
  type = 'close',
  rightElement
}: Props) {
  const { top: topHeight } = useSafeAreaInsets()

  return (
    <>
      <StatusBar style="auto" />
      <HStack
        p={4}
        style={{ marginTop: Platform.OS === 'ios' ? 0 : topHeight }}
        alignItems="center"
        justifyContent="center"
      >
        <Pressable position="absolute" left="4" onPress={onPress}>
          {type === 'close' && (
            <MaterialCommunityIcons name="close" color="#52525b" size={24} />
          )}

          {type === 'back' && (
            <Feather name="chevron-left" color="#52525b" size={24} />
          )}
        </Pressable>
        <Text mt={1} fontSize="md" fontWeight="semibold">
          {title}
        </Text>
        {rightElement}
      </HStack>
    </>
  )
}
