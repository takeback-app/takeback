import React from 'react'
import { Center, Text } from 'native-base'

import Illustration from '../../../assets/illustration10.svg'

export function NotConnectedScreen() {
  return (
    <Center flex="1" bgColor="#F5F5F5">
      <Illustration />
      <Text fontWeight="normal" fontSize="md" color="gray.600">
        Sem conexão com a internet
      </Text>
    </Center>
  )
}
