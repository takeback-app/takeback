import React from 'react'
import { Pressable, Text } from 'native-base'

interface InfoProps {
  title: string
  value: string
  borderB?: boolean
  onPress?: () => void
}

export function Info({ borderB = false, ...props }: InfoProps) {
  return (
    <Pressable
      py="1"
      px="4"
      minH="60px"
      justifyContent="center"
      bgColor="white"
      borderColor="gray.400"
      borderTopWidth="1"
      borderBottomWidth={borderB ? '1' : '0'}
      onPress={props.onPress}
    >
      <Text fontSize="sm" fontWeight="medium" color="gray.800">
        {props.title}
      </Text>
      {props.value && (
        <Text
          fontSize="sm"
          fontWeight="normal"
          color="gray.600"
          numberOfLines={1}
        >
          {props.value}
        </Text>
      )}
    </Pressable>
  )
}
