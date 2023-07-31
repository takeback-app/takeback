import React from 'react'

import { Feather } from '@expo/vector-icons'
import { Box, Button, HStack, Input } from 'native-base'

interface NumberInputProps {
  number: number
  setNumber: React.Dispatch<React.SetStateAction<number>>
  min?: number
  max?: number
}

export function NumberInput({ number, setNumber, max, min }: NumberInputProps) {
  function increase() {
    if (max && number >= max) return

    setNumber(state => state + 1)
  }

  function decrease() {
    if (min && number <= min) return

    setNumber(state => state - 1)
  }

  return (
    <HStack flex={1}>
      <Button
        px={3}
        colorScheme="blue"
        borderRightRadius={0}
        borderLeftRadius="lg"
        isDisabled={number === min}
        onPress={decrease}
      >
        <Feather name="minus" size={12} color="white" />
      </Button>
      <Box>
        <Input
          w={16}
          fontSize="sm"
          rounded="none"
          textAlign="center"
          fontWeight="medium"
          editable={false}
          value={String(number)}
        />
      </Box>

      <Button
        px={3}
        colorScheme="blue"
        borderRightRadius="lg"
        borderLeftRadius={0}
        isDisabled={number === max}
        onPress={increase}
      >
        <Feather name="plus" size={12} color="white" />
      </Button>
    </HStack>
  )
}
