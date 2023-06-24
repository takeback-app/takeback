import React from 'react'

import { Box } from '@chakra-ui/react'

export function Dot() {
  return (
    <Box
      position="absolute"
      w={3}
      h={3}
      bg="red.500"
      rounded="full"
      right={4}
      top={3}
    />
  )
}
