import React, { useContext, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { Button, Heading, Text, VStack } from 'native-base'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'

import { UserDataContext } from '../../../contexts/UserDataContext'
import { PrivateRouteParam, PrivateRouteProps } from '../../../@types/routes'
import { masks } from '../../../utils'
import { MaskedTextInput } from 'react-native-mask-text'
import { AlertComponent } from '../../../components/alert'

interface TransferValueProps {
  navigation: NativeStackNavigationProp<PrivateRouteParam>
  route: PrivateRouteProps<'transferValue'>
}

export function TransferValue({ navigation, route }: TransferValueProps) {
  const { userId, userName } = route?.params
  const { balance } = useContext(UserDataContext)

  const [value, setValue] = useState('')
  const [showInfo, setShowInfo] = useState(false)

  function goBack() {
    navigation.goBack()
  }

  function setTransferValue(value: string, rowValue: string) {
    if (isNaN(parseInt(rowValue))) {
      return setValue('R$0,00')
    }

    setValue(value)
  }

  function navigateToGetPassword() {
    setShowInfo(false)

    const valueReplaced = parseFloat(value.replace('R$', '').replace(',', '.'))

    // É necessário fazer esses cálculos para evitar erros de float-precision
    if (Math.floor(valueReplaced * 100) > Math.floor(balance * 100)) {
      return setShowInfo(true)
    }

    navigation.navigate('transferConfirmation', {
      userId,
      userName,
      value: valueReplaced
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
              Qual é o valor da transferência?
            </Heading>
            <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
              Saldo disponível: {masks.maskCurrency(balance)}
            </Text>

            <MaskedTextInput
              keyboardType="numeric"
              onChangeText={setTransferValue}
              type="currency"
              options={{
                prefix: 'R$',
                decimalSeparator: ',',
                groupSeparator: '.',
                precision: 2
              }}
              maxLength={10}
              value={value}
              autoFocus={true}
              style={{
                borderBottomWidth: 1,
                borderColor: '#449FE7',
                fontFamily: 'Montserrat_600SemiBold',
                fontSize: 32,
                marginTop: 32,
                marginBottom: 12
              }}
            />

            <AlertComponent
              status="info"
              title="Saldo insuficiente"
              showAlert={showInfo}
              closeAlert={() => setShowInfo(false)}
            />
          </VStack>

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
            isDisabled={
              parseFloat(value.replace('R$', '').replace(',', '.')) <= 0
            }
            onPress={navigateToGetPassword}
          >
            Próximo
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </Layout>
  )
}
