import React from 'react'
import { Text, Pressable, HStack, Icon } from 'native-base'
import { Ionicons, Feather } from '@expo/vector-icons'

interface HeaderProps {
  variant?: 'arrow' | 'close'
  title?: string
  goBack?: () => void
  info?: () => void
  onEdit?: () => void
  left?: React.ReactNode
}

export function Header({
  goBack,
  info,
  left,
  onEdit,
  title,
  variant
}: HeaderProps) {
  return (
    <HStack justifyContent="space-between" alignItems="center" h="12" px="4">
      <Pressable onPress={goBack}>
        {variant === 'arrow' ? (
          <Icon
            as={Ionicons}
            name="ios-chevron-back"
            size="2xl"
            color="gray.800"
          />
        ) : (
          <Icon as={Ionicons} name="close" size="2xl" color="gray.800" />
        )}
      </Pressable>

      {title ? (
        <Text fontWeight="semibold" fontSize="lg" color="gray.800">
          {title}
        </Text>
      ) : null}

      <HStack
        alignItems="center"
        space="2"
        w={info || onEdit || left ? undefined : '32px'}
      >
        {onEdit && (
          <Pressable onPress={onEdit}>
            <Icon as={Feather} name="edit" size="lg" color="gray.800" />
          </Pressable>
        )}

        <Pressable onPress={info}>
          {info && (
            <Icon
              as={Ionicons}
              name="help-circle-outline"
              size="xl"
              color="gray.800"
            />
          )}
        </Pressable>
        {left}
      </HStack>
    </HStack>
  )
}
