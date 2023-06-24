import React, { useContext, useEffect } from 'react'
import { BackHandler } from 'react-native'
import { Center, Heading, Stack, Text, Button } from 'native-base'

import { Layout } from '../../../components/layout'

import Illustration from '../../../assets/illustration3.svg'
import { saveNotificationToken } from '../../../services'
import { useNotification } from '../../../stores/useNotification'
import { AuthContext } from '../../../contexts/AuthContext'

export function SignUpSuccess({ navigation }) {
  const notificationToken = useNotification(state => state.token)

  const { setIsSignedIn } = useContext(AuthContext)

  async function navigateToSignIn() {
    await saveNotificationToken(notificationToken)

    setIsSignedIn(true)

    // navigation.navigate('signIn')
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true)
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true)
  }, [])

  return (
    <Layout>
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
            Cadastro realizado com sucesso!
          </Heading>
          <Text
            fontSize="md"
            color="gray.600"
            fontWeight="medium"
            textAlign="center"
          >
            Acesse o app e comece a ganhar CASHBACK!
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
