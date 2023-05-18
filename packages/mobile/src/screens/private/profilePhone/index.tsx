import React, { useContext, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { VStack, Button, Input } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { mask, unMask } from 'react-native-mask-text'

import { API } from '../../../services/API'
import { UserDataContext } from '../../../contexts/UserDataContext'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'
import { Dialog } from '../../../components/dialog'

import { PrivateRouteParam } from '../../../@types/routes'

export function ProfilePhone() {
  const { userData, setUserData } = useContext(UserDataContext)
  const [isDisabled, setIsDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [phone, setPhone] = useState(mask(userData.phone, '(99) 9 9999-9999'))

  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  function goBack() {
    navigation.goBack()
  }

  function openConfirmEditPhoneDialog() {
    setDialogOpen(true)
  }

  function handleEditMail() {
    setDialogOpen(false)
    setIsLoading(true)

    API.put('/costumer/update/phone', {
      phone: unMask(phone)
    })
      .then(response => {
        setUserData(response.data)
      })
      .finally(() => {
        setIsLoading(false)
        setIsDisabled(true)
      })
  }

  function handleCancel() {
    setPhone(mask(userData.phone, '(99) 9 9999-9999'))
    setDialogOpen(false)
  }

  return (
    <Layout>
      <Header
        title="Meu número"
        variant="arrow"
        goBack={goBack}
        onEdit={() => setIsDisabled(false)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <VStack p="4" space="1">
          <Input
            variant={isDisabled ? 'unstyled' : 'underlined'}
            value={phone}
            fontWeight="semibold"
            fontSize="xl"
            color="gray.800"
            p="0"
            isDisabled={isDisabled || isLoading}
            keyboardType="numeric"
            onChangeText={e => setPhone(mask(e, '(99) 9 9999-9999'))}
            _disabled={{
              opacity: 1
            }}
            _focus={{
              borderColor: 'gray.600'
            }}
          />
        </VStack>

        {!isDisabled && (
          <Button
            h="12"
            mx="4"
            rounded="full"
            bgColor="blue.600"
            onPress={openConfirmEditPhoneDialog}
            isDisabled={userData.phone === unMask(phone) || phone.length < 8}
            isLoading={isLoading}
            _pressed={{
              bgColor: 'blue.400'
            }}
            _text={{
              fontSize: 'md',
              fontWeight: 'medium'
            }}
          >
            Alterar número
          </Button>
        )}
      </KeyboardAvoidingView>

      <Dialog
        title="Confirma a alteração do seu número?"
        isOpen={dialogOpen}
        onClose={handleCancel}
        onConfirm={handleEditMail}
      />
    </Layout>
  )
}
