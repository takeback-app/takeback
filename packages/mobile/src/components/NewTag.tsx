import React from 'react'

import { Flex, IFlexProps, Text } from 'native-base'

export function NewTag(props: IFlexProps) {
  return (
    <Flex
      flexDirection="row"
      align="center"
      px={1}
      py={0.5}
      rounded="sm"
      bg="green.500"
      {...props}
    >
      <Text color="white" fontSize="8px" fontWeight="bold">
        Novo
      </Text>
    </Flex>
  )
}
