import React, { useState } from 'react'
import { Button, Heading, Input, Text, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { mask } from 'react-native-mask-text'

import { API } from '../../../services/API'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'
import { AlertComponent } from '../../../components/alert'

import { PrivateRouteParam } from '../../../@types/routes'
import { KeyboardAvoidingView, Platform } from 'react-native'

export function TransferUser() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  const [cpf, setCpf] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Houve um erro')

  function goBack() {
    navigation.goBack()
  }

  function getConsumerReceiveInfo() {
    setIsLoading(true)
    setIsError(false)
    API.get(`costumer/transfer/get-consumer/${cpf.replace(/\D/g, '')}`)
      .then(response => {
        navigation.navigate('transferValue', {
          userId: response.data.id,
          userName: response.data.fullName
        })
      })
      .catch(error => {
        setIsError(true)
        setErrorMessage(error.response.data.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Layout>
      <Header variant="arrow" title="Transferir" goBack={goBack} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <VStack flex="1" justifyContent="space-between" pb="4" px="4">
          <VStack mt="4">
            <Heading fontSize="3xl" color="gray.800" fontWeight="bold">
              Para quem você deseja transferir?
            </Heading>
            <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
              Informe o CPF de quem você deseja transferir.
            </Text>

            <Input
              variant="underlined"
              mt="12"
              mb="4"
              fontWeight="semibold"
              fontSize="3xl"
              color="gray.800"
              keyboardType="numeric"
              keyboardAppearance="light"
              autoFocus={true}
              value={cpf}
              onChangeText={e => setCpf(mask(e, '999.999.999-99'))}
              _focus={{
                borderColor: 'blue.600'
              }}
            />

            <AlertComponent
              status="info"
              title={errorMessage}
              showAlert={isError}
              closeAlert={() => setIsError(false)}
            />
          </VStack>

          <Button
            h="12"
            rounded="full"
            bgColor="blue.600"
            isLoading={isLoading}
            isDisabled={cpf.replace(/\D/g, '').length < 11}
            _pressed={{
              bgColor: 'blue.400'
            }}
            _text={{
              fontSize: 'md',
              fontWeight: 'medium'
            }}
            onPress={getConsumerReceiveInfo}
          >
            Próximo
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </Layout>
  )
}
