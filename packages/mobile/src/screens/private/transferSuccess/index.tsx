import React, { useEffect } from 'react'
import { BackHandler } from 'react-native'
import { Center, Heading, Stack, Text } from 'native-base'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'

import Illustration from '../../../assets/illustration7.svg'
import { masks } from '../../../utils'

export function TransferSuccess({ navigation, route }) {
  const { userName, value } = route?.params

  function navigateToHome() {
    navigation.navigate('home')
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true)
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true)
  }, [])

  return (
    <Layout>
      <Header variant="close" title="" goBack={navigateToHome} />
      <Stack flex="1" px="4" py="8" space="8" justifyContent="center">
        <Center>
          <Illustration />
          <Heading
            fontSize="3xl"
            color="gray.800"
            fontWeight="bold"
            textAlign="center"
            mt="8"
          >
            Sua transferência foi enviada
          </Heading>
        </Center>

        <Center
          borderStyle="dashed"
          borderWidth="1"
          borderColor="gray.600"
          rounded="md"
          py="8"
        >
          <Heading
            fontSize="3xl"
            color="gray.800"
            fontWeight="bold"
            textAlign="center"
          >
            {masks.maskCurrency(value)}
          </Heading>
          <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
            para{' '}
            <Text fontWeight="bold" color="gray.800" textTransform="capitalize">
              {userName}
            </Text>
          </Text>
          <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
            Agora mesmo
          </Text>
        </Center>
      </Stack>
    </Layout>
  )
}
