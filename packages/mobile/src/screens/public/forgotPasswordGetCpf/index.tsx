import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Heading, Stack, Text, Button } from 'native-base'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'
import { CustomInput } from '../../../components/input'
import { AlertComponent } from '../../../components/alert'

import { PublicRouteParam } from '../../../@types/routes'

import { maskCPF } from '../../../utils/masks'
import { API } from '../../../services/API'

export function ForgotPasswordGetCpf() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PublicRouteParam>>()

  const [cpf, setCpf] = useState('')
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)

  function navigateToSignIn() {
    navigation.navigate('signIn')
  }

  function navigateToForgotPasswordSuccess() {
    if (!cpf || cpf.length !== 14) {
      return setShowError(true)
    }

    setLoading(true)

    API.post('/costumer/forgot-password', {
      cpf
    }).finally(() => {
      setLoading(false)
      navigation.navigate('forgotPasswordSuccess')
    })

    setShowError(false)
  }

  return (
    <Layout>
      <Header variant="close" goBack={navigateToSignIn} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Stack flex="1" px="4" pb="8" justifyContent="space-between">
          <Stack mt="4" space="2">
            <Heading fontSize="3xl" color="blue.600" fontWeight="bold">
              Vamos recuperar sua senha! Primeiro, informe seu CPF.
            </Heading>
            <Text fontSize="md" color="gray.600" fontWeight="medium">
              Você receberá em seu e-mail um link para que você possa criar uma
              nova senha!
            </Text>

            <CustomInput
              label="CPF"
              keyboardType="numeric"
              keyboardAppearance="light"
              maxLength={14}
              autoFocus={true}
              value={cpf}
              onChangeText={e => setCpf(maskCPF(e))}
            />

            <AlertComponent
              status="info"
              showAlert={showError}
              closeAlert={() => setShowError(false)}
              title="Informe seu CPF"
            />
          </Stack>

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
            onPress={navigateToForgotPasswordSuccess}
            isLoading={loading}
          >
            Recuperar senha
          </Button>
        </Stack>
      </KeyboardAvoidingView>
    </Layout>
  )
}
