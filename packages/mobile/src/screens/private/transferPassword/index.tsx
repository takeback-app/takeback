import React, { useContext, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { Button, Flex, Heading, VStack } from 'native-base'

import { API } from '../../../services/API'
import { UserDataContext } from '../../../contexts/UserDataContext'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'
import { CustomInput } from '../../../components/input'
import { AlertComponent } from '../../../components/alert'

export function TransferPassword({ navigation, route }) {
  const { userId, userName, value } = route?.params
  const { setUserData } = useContext(UserDataContext)

  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)

  function goBack() {
    navigation.goBack()
  }

  function handleTransfer() {
    setIsLoading(true)
    setIsError(false)

    API.post('costumer/transfer/consumer', {
      password,
      sentConsumerId: userId,
      value
    })
      .then(response => {
        setUserData({
          totalSaved: response.data.totalSaved,
          ...response.data.consumerData
        })
        navigation.navigate('transferSuccess', {
          userName,
          value
        })
      })
      .catch(() => setIsError(true))
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
            <Heading fontSize="3xl" color="gray.800" fontWeight="bold" mb="4">
              Digite sua senha de seis números
            </Heading>

            <CustomInput
              label="Senha"
              keyboardAppearance="light"
              keyboardType="numeric"
              maxLength={6}
              isPassword
              autoFocus={true}
              value={password}
              onChangeText={e => setPassword(e)}
            />

            <Flex mt="4">
              <AlertComponent
                status="info"
                title="Erro ao transferir"
                message="Por favor, verifique sua senha e tente novamente"
                showAlert={isError}
                closeAlert={() => setIsError(false)}
              />
            </Flex>
          </VStack>

          <Button
            h="12"
            rounded="full"
            bgColor="blue.600"
            isLoading={isLoading}
            isDisabled={password.length < 6}
            _pressed={{
              bgColor: 'blue.400'
            }}
            _text={{
              fontSize: 'md',
              fontWeight: 'medium'
            }}
            onPress={handleTransfer}
          >
            Confirmar
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </Layout>
  )
}
