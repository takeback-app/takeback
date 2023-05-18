import React from 'react'
import { Center, Text } from 'native-base'

import Illustration from '../../../../assets/illustration10.svg'

export function EmptyComponent() {
  return (
    <Center>
      <Illustration />
      <Text
        fontWeight="normal"
        fontSize="md"
        color="gray.600"
        textAlign="center"
      >
        Nenhuma transação realizada
      </Text>
    </Center>
  )
}
