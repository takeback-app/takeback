import React from 'react'

import { Flex, Text, Tooltip } from '@chakra-ui/react'

export function WarningMessage({ message }: { message: string }) {
  if (!message) return null

  return (
    <Flex
      maxW={{ base: 32, md: 64, lg: 96 }}
      mr={4}
      bg="red.500"
      borderRadius="md"
      p={2}
    >
      <Tooltip label={message} textAlign="center" marginTop="1">
        <Text
          noOfLines={2}
          color="white"
          align="center"
          fontWeight="semibold"
          fontSize="xs"
        >
          {message}
        </Text>
      </Tooltip>
    </Flex>
  )
}
