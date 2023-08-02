import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Flex, IFlexProps, Text } from 'native-base'
import { Platform } from 'react-native'

interface ProductItemTagProps extends IFlexProps {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap
}

export function ProductItemTag({
  children,
  iconName,
  ...rest
}: ProductItemTagProps) {
  return (
    <Flex
      flexDirection="row"
      align="center"
      position="absolute"
      px={1}
      py={0.5}
      rounded="sm"
      top={2}
      left={2}
      shadow={Platform.OS === 'ios' ? 2 : undefined}
      {...rest}
    >
      <MaterialCommunityIcons name={iconName} size={12} color="white" />
      <Text color="white" fontSize="xs" ml={1} fontWeight="semibold">
        {children}
      </Text>
    </Flex>
  )
}
