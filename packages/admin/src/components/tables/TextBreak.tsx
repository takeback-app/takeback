import React from 'react'
import { Text, TextProps } from '@chakra-ui/react'

export function TextBreak({ children, ...rest }: TextProps) {
  return (
    <Text w="100px" whiteSpace="normal" wordBreak="break-word" {...rest}>
      {children}
    </Text>
  )
}
