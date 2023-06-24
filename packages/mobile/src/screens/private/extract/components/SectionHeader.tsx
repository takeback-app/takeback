import { Box, Text } from 'native-base'
import React from 'react'

interface SectionHeaderProps {
  text: string
}

export function SectionHeader({ text }: SectionHeaderProps) {
  return (
    <Box
      bg="white"
      borderBottomColor="gray.300"
      borderBottomWidth={2}
      px={3}
      py={4}
    >
      <Text fontWeight="bold" fontSize="lg">
        {text}
      </Text>
    </Box>
  )
}
