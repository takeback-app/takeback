import React, { useContext, useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import {
  HStack,
  VStack,
  Text,
  Button,
  Icon,
  Input,
  Pressable
} from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'

import { API } from '../../../services/API'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'
import { SuccessDialog } from './components/successDialog'
import { UserDataContext } from '../../../contexts/UserDataContext'

import { PrivateRouteParam } from '../../../@types/routes'
import { AlertComponent } from '../../../components/alert'

export function ProfileEmailVerify() {
  const { setUserData } = useContext(UserDataContext)
  const [code, setCode] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resendCode, setResendCode] = useState(false)
  const [showError, setShowError] = useState(false)

  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  function goBack() {
    navigation.goBack()
  }

  function sendCodeToEmail() {
    setShowError(false)
    API.get('/costumer/verify/send-mail').then(() => {
      setResendCode(false)
      resendCodeToEmail()
    })
  }

  function validateCode() {
    setIsLoading(true)
    setShowError(false)

    API.post('/costumer/verify/email', {
      code
    })
      .then(response => {
        setUserData(response.data)
        setDialogOpen(true)
      })
      .catch(() => setShowError(true))
      .finally(() => {
        setIsLoading(false)
      })
  }

  const resendCodeToEmail = () => {
    setTimeout(() => {
      setResendCode(true)
    }, 15000)
  }

  useEffect(() => {
    sendCodeToEmail()
    resendCodeToEmail()
  }, [])

  return (
    <Layout>
      <Header title="Verificar email" variant="arrow" goBack={goBack} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <VStack p="4">
          <AlertComponent
            status="error"
            showAlert={showError}
            closeAlert={() => setShowError(false)}
            title="Erro ao validar seu email"
            message="Por favor, verifique o código e tente novamente."
          />

          <Text fontWeight="bold" fontSize="lg" color="gray.800">
            Insira o código que enviamos no seu email
          </Text>

          <Input
            variant="underlined"
            value={code}
            fontWeight="semibold"
            fontSize="2xl"
            color="gray.800"
            keyboardType="numeric"
            isDisabled={isLoading || !sendCodeToEmail}
            onChangeText={e => setCode(e)}
            _disabled={{
              opacity: 1
            }}
            _focus={{
              borderColor: 'gray.600'
            }}
          />

          <Pressable onPress={sendCodeToEmail}>
            <HStack alignItems="center" space="1">
              <Icon
                as={Ionicons}
                name={
                  resendCode
                    ? 'alert-circle-outline'
                    : 'checkmark-circle-outline'
                }
                size="sm"
                color={resendCode ? 'gray.800' : 'green.500'}
              />
              <Text
                fontWeight="normal"
                fontSize="sm"
                color={resendCode ? 'gray.800' : 'green.500'}
              >
                {resendCode
                  ? 'Toque para enviar um novo código'
                  : 'Código enviado!'}
              </Text>
            </HStack>
          </Pressable>
        </VStack>

        <Button
          h="12"
          mx="4"
          rounded="full"
          bgColor="blue.600"
          onPress={validateCode}
          isLoading={isLoading}
          isDisabled={code.length < 4}
          _pressed={{
            bgColor: 'blue.400'
          }}
          _text={{
            fontSize: 'md',
            fontWeight: 'medium'
          }}
        >
          Confirmar código
        </Button>
      </KeyboardAvoidingView>

      <SuccessDialog
        title="Seu email foi verificado com sucesso!"
        isOpen={dialogOpen}
        onConfirm={() => navigation.goBack()}
      />
    </Layout>
  )
}
