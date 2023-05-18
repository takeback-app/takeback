import React from 'react'
import { Center, Spinner } from 'native-base'

export function LoadingScreen() {
  return (
    <Center flex="1" bgColor="blue.400">
      <Spinner color="white" size="lg" />
    </Center>
  )
}
