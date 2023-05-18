import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Stack, Button, Flex } from 'native-base'
import { Header } from '../../../components/header'
import { mask, unMask } from 'react-native-mask-text'

import { Layout } from '../../../components/layout'
import { CustomInput } from '../../../components/input'
import { AlertComponent } from '../../../components/alert'

import { PublicRouteParam } from '../../../@types/routes'
import { sendWhatsAppMessage } from '../../../utils'

export function SignIn() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PublicRouteParam>>()

  const [cpf, setCpf] = useState('')
  const [showError, setShowError] = useState(false)

  function navigateToWelcome() {
    navigation.navigate('welcome')
  }

  function navigateToGetPassword() {
    setShowError(false)

    if (!cpf || cpf.length !== 14) {
      return setShowError(true)
    }

    navigation.navigate('signInPassword', {
      cpf: unMask(cpf)
    })
  }

  return (
    <Layout barProps={{ style: 'dark' }}>
      <Header
        variant="arrow"
        title="Login Takeback"
        goBack={navigateToWelcome}
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
              label="CPF"
              keyboardType="numeric"
              keyboardAppearance="light"
              maxLength={14}
              autoFocus={true}
              value={cpf}
              onChangeText={e => setCpf(mask(e, '999.999.999-99'))}
            />
            <Flex direction="row" justifyContent="flex-end" alignItems="center">
              <Button
                variant="link"
                colorScheme="blue"
                _text={{
                  fontWeight: 'medium'
                }}
                onPress={sendWhatsAppMessage}
              >
                Precisa de ajuda? Fale com um suporte.
              </Button>
            </Flex>

            <Stack py={showError ? '4' : '0'}>
              <AlertComponent
                status="info"
                showAlert={showError}
                closeAlert={() => setShowError(false)}
                title="Informe seu CPF"
              />
            </Stack>
          </Stack>
          <Flex>
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
              onPress={navigateToGetPassword}
            >
              Próximo
            </Button>
            <Button
              variant="link"
              colorScheme="blue"
              _text={{
                fontWeight: 'medium'
              }}
              onPress={() => navigation.navigate('createAccount')}
            >
              Não tem uma conta? Cadastre-se!
            </Button>
          </Flex>
        </Stack>
      </KeyboardAvoidingView>
    </Layout>
  )
}
