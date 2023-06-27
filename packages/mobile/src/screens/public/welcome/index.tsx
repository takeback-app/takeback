import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Box, Button, Heading, Text, VStack } from 'native-base'

import { PublicRouteParam } from '../../../@types/routes'

import bg from '../../../../assets/img/bg.png'
import { StatusBar } from 'expo-status-bar'

export function Welcome() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PublicRouteParam>>()

  function navigateToSignIn() {
    navigation.navigate('signIn')
  }

  function navigateToSignUp() {
    navigation.navigate('createAccount')
  }

  return (
    <ImageBackground source={bg} resizeMode="cover" style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#00000000', '#000']}
        locations={[0.4, 1]}
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
        <Box w="full" px="4" py="8">
          <Heading fontSize="4xl" color="white" fontWeight="bold">
            Bem vindo(a) ao Takeback!
          </Heading>
          <Text fontSize="md" color="white" fontWeight="medium">
            Com o Takeback você ganha em cada compra que fizer! Cadastre-se e
            comece a ganhar ainda hoje.
          </Text>
          <VStack space="2" mt="8">
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
              onPress={navigateToSignUp}
            >
              Criar conta
            </Button>
            <Button
              mt={-2}
              variant="ghost"
              _text={{
                fontSize: 'sm',
                color: 'white'
              }}
              _pressed={{
                bgColor: 'transparent'
              }}
              onPress={navigateToSignIn}
            >
              Já é usuário? Faça login
            </Button>
          </VStack>
        </Box>
      </LinearGradient>
    </ImageBackground>
  )
}
