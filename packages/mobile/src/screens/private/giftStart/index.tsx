import React from 'react'
import { Center, Heading, Stack, Text } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'

import { PrivateRouteParam } from '../../../@types/routes'
import Illustration from '../../../assets/illustration3.svg'

export function GiftStart() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  function navigateGoBack() {
    navigation.goBack()
  }

  return (
    <Layout>
      <Header variant="arrow" title="" goBack={navigateGoBack} />
      <Stack flex="1" px="4" py="8" justifyContent="center">
        <Center>
          <Illustration />
          <Heading
            fontSize="3xl"
            color="blue.600"
            fontWeight="bold"
            textAlign="center"
            mt="8"
          >
            Indique um amigo e ganhe!
          </Heading>
          <Text
            fontSize="md"
            color="gray.600"
            fontWeight="medium"
            textAlign="center"
          >
            Acesse o app e comece a ganhar CASHBACK!
          </Text>
        </Center>
      </Stack>
    </Layout>
  )
}
