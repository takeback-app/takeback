import { Flex, IFlexProps } from 'native-base'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function BottomCard({ children, ...rest }: IFlexProps) {
  const { bottom } = useSafeAreaInsets()

  return (
    <Flex
      px={6}
      pt={4}
      w="full"
      style={{ paddingBottom: bottom + 4 }}
      borderTopColor="gray.400"
      borderTopWidth={1}
      bg="white"
      {...rest}
    >
      {children}
    </Flex>
  )
}
