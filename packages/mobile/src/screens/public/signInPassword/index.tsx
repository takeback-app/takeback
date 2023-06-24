import React, { useContext, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Stack, Button, Flex, Text, Pressable, Icon } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'
import { CustomInput } from '../../../components/input'
import { AlertComponent } from '../../../components/alert'
import { API } from '../../../services/API'
import { storeData } from '../../../utils/StoreData'
import { AuthContext } from '../../../contexts/AuthContext'

import { saveNotificationToken } from '../../../services'
import { useNotification } from '../../../stores/useNotification'
import { authenticate } from '../../../utils/authenticate'

export function SignInPassword({ navigation, route }) {
  const { cpf } = route?.params

  const notificationToken = useNotification(state => state.token)

  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)

  const { setIsSignedIn } = useContext(AuthContext)

  function navigateToSignIn() {
    navigation.navigate('signIn')
  }

  function navigateToForgotPassword() {
    navigation.navigate('forgotPasswordStart')
  }

  function handleLogin() {
    if (!cpf || !password) {
      return setShowError(true)
    }

    setLoading(true)

    API.post('/costumer/sign-in', {
      cpf,
      password
    })
      .then(async ({ data }) => {
        authenticate(data.token, data.refreshToken, remember)

        await saveNotificationToken(notificationToken)

        setIsSignedIn(true)
      })
      .catch(() => {
        setShowError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Layout barProps={{ style: 'dark' }}>
      <Header
        variant="arrow"
        title="Login Takeback"
        goBack={navigateToSignIn}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Stack
          flex="1"
          px="4"
          pb="8"
          justifyContent="space-between"
          bg="gray.300"
        >
          <Stack mt="4" space="2">
            <CustomInput
              label="Senha"
              keyboardAppearance="light"
              keyboardType="numeric"
              maxLength={6}
              autoFocus={true}
              isPassword
              isDisabled={loading}
              value={password}
              onChangeText={e => setPassword(e)}
            />
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Flex direction="row" alignItems="center">
                <Pressable
                  flexDirection="row"
                  alignItems="center"
                  onPress={() => setRemember(!remember)}
                >
                  <Icon
                    as={Ionicons}
                    name={remember ? 'checkbox' : 'square-outline'}
                    size="md"
                    color={remember ? 'blue.400' : 'gray.800'}
                  />
                  <Text fontWeight="medium" color="gray.800" ml="1">
                    Manter logado
                  </Text>
                </Pressable>
              </Flex>

              <Button
                variant="link"
                _text={{
                  fontWeight: 'medium',
                  color: 'blue.600'
                }}
                onPress={navigateToForgotPassword}
              >
                Esqueceu a senha?
              </Button>
            </Flex>

            <Stack py={showError ? '4' : '0'}>
              <AlertComponent
                status="error"
                showAlert={showError}
                closeAlert={() => setShowError(false)}
                title="Erro ao realizar login"
                message="Por favor, verifique seu CPF e sua Senha e tente novamente"
              />
            </Stack>
          </Stack>

          <Stack>
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
              isLoading={loading}
              onPress={handleLogin}
            >
              Entrar
            </Button>
          </Stack>
        </Stack>
      </KeyboardAvoidingView>
    </Layout>
  )
}
