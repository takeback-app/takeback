import React, { useEffect } from 'react'
import { BackHandler } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button, Center, Heading, Text, Stack } from 'native-base'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'

import { PublicRouteParam } from '../../../@types/routes'

import Illustration from '../../../assets/illustration5.svg'

export function ForgotPasswordSuccess() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PublicRouteParam>>()

  function navigateToSignIn() {
    navigation.navigate('signIn')
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true)
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true)
  }, [])

  return (
    <Layout>
      <Header variant="close" goBack={navigateToSignIn} />
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
            Prontinho! Cheque a sua caixa de e-mail.
          </Heading>
          <Text
            fontSize="md"
            color="gray.600"
            fontWeight="medium"
            textAlign="center"
          >
            Enviamos um e-mail com o link de redefinição de senha para você.
          </Text>

          <Button
            w="full"
            h="12"
            rounded="full"
            bgColor="blue.600"
            mt="8"
            _pressed={{
              bgColor: 'blue.400'
            }}
            _text={{
              fontSize: 'md',
              fontWeight: 'medium'
            }}
            onPress={navigateToSignIn}
          >
            Acessar o aplicativo
          </Button>
        </Center>
      </Stack>
    </Layout>
  )
}
