import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button, Center, Heading, Text, Stack } from 'native-base'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'
import { PublicRouteParam } from '../../../@types/routes'

import Illustration from '../../../assets/illustration4.svg'

export function ForgotPasswordStart() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PublicRouteParam>>()

  function goBack() {
    navigation.goBack()
  }

  function navigateToforgotPasswordGetCpf() {
    navigation.navigate('forgotPasswordGetCpf')
  }
  return (
    <Layout>
      <Header variant="arrow" goBack={goBack} />
      <Stack flex="1" px="4" py="8" justifyContent="space-between">
        <Center>
          <Illustration />
          <Stack mt="4">
            <Heading fontSize="3xl" color="blue.600" fontWeight="bold">
              Esqueceu a sua senha? Vamos recuperá-la!
            </Heading>
            <Text fontSize="md" color="gray.600" fontWeight="medium">
              Recuperar a sua senha é simples e rápido! Toque no botão abaixo,
              recupere sua senha e volte a ganhar cashback.
            </Text>
          </Stack>
        </Center>

        <Button
          h="12"
          rounded="full"
          bgColor="blue.600"
          _pressed={{
            bgColor: 'blue.400'
          }}
          _text={{
            fontSize: 'md',
            fontWeight: 'medium'
          }}
          onPress={navigateToforgotPasswordGetCpf}
        >
          Recuperar senha
        </Button>
      </Stack>
    </Layout>
  )
}
