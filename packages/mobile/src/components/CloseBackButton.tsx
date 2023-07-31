import { MaterialCommunityIcons } from '@expo/vector-icons'
import { IPressableProps, Pressable, View } from 'native-base'
import React from 'react'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function CloseBackButton(props: IPressableProps) {
  const { top } = useSafeAreaInsets()

  return (
    <Pressable
      {...props}
      position="absolute"
      shadow="1"
      style={{ top: Platform.OS === 'ios' ? 8 : top }}
      right={2}
      p={2}
    >
      <View bg="white" rounded="full" p={1.5}>
        <MaterialCommunityIcons name="close" size={24} />
      </View>
    </Pressable>
  )
}
