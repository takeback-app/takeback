import React from 'react'
import { Center, Text } from 'native-base'

import Illustration from '../../assets/illustration10.svg'
import { Dimensions } from 'react-native'

interface EmptyComponentProps {
  text: string
}

export function EmptyComponent({ text }: EmptyComponentProps) {
  return (
    <Center h={Dimensions.get('screen').height - 300}>
      <Illustration />
      <Text
        fontWeight="semibold"
        fontSize="lg"
        color="gray.600"
        mt={4}
        textAlign="center"
      >
        {text}
      </Text>
    </Center>
  )
}
