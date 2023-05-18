import React, { useContext, useState } from 'react'
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
import { Dialog } from '../../../components/dialog'
import { UserDataContext } from '../../../contexts/UserDataContext'

import { PrivateRouteParam } from '../../../@types/routes'
import { KeyboardAvoidingView, Platform } from 'react-native'

export function ProfileEmail() {
  const { userData, setUserData } = useContext(UserDataContext)
  const [isDisabled, setIsDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [mail, setMail] = useState(userData.email || '')
  const [dialogOpen, setDialogOpen] = useState(false)

  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  function goBack() {
    navigation.goBack()
  }

  function openConfirmEditMailDialog() {
    setDialogOpen(true)
  }

  function handleEditMail() {
    setDialogOpen(false)
    setIsLoading(true)

    API.put('/costumer/update/email', {
      email: mail
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
    setMail(userData.email)
    setDialogOpen(false)
  }

  return (
    <Layout>
      <Header
        title="Meu email"
        variant="arrow"
        goBack={goBack}
        onEdit={() => setIsDisabled(false)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <VStack p="4">
          <Input
            variant={isDisabled ? 'unstyled' : 'underlined'}
            value={mail}
            fontWeight="semibold"
            fontSize="sm"
            color="gray.800"
            p="0"
            isDisabled={isDisabled || isLoading}
            onChangeText={e => setMail(e)}
            _disabled={{
              opacity: 1
            }}
            _focus={{
              borderColor: 'gray.600'
            }}
          />
          {isDisabled && (
            <Pressable
              onPress={() => navigation.navigate('profileEmailVerify')}
              disabled={userData.emailConfirmated}
            >
              <HStack alignItems="center" space="1">
                <Icon
                  as={Ionicons}
                  name={
                    userData.emailConfirmated
                      ? 'checkmark-circle-outline'
                      : 'ios-alert-circle-outline'
                  }
                  size="sm"
                  color={userData.emailConfirmated ? 'green.500' : 'red.500'}
                />
                <Text
                  fontWeight="normal"
                  fontSize="sm"
                  color={userData.emailConfirmated ? 'green.500' : 'red.500'}
                >
                  {userData.emailConfirmated
                    ? 'Seu email está verificado!'
                    : 'Confirmar seu email'}
                </Text>
              </HStack>
            </Pressable>
          )}
        </VStack>

        {!isDisabled && (
          <Button
            h="12"
            mx="4"
            rounded="full"
            bgColor="blue.600"
            onPress={openConfirmEditMailDialog}
            isDisabled={userData.email === mail || mail.length < 8}
            isLoading={isLoading}
            _pressed={{
              bgColor: 'blue.400'
            }}
            _text={{
              fontSize: 'md',
              fontWeight: 'medium'
            }}
          >
            Alterar email
          </Button>
        )}
      </KeyboardAvoidingView>

      <Dialog
        title="Confirma a alteração do seu email?"
        isOpen={dialogOpen}
        onClose={handleCancel}
        onConfirm={handleEditMail}
      />
    </Layout>
  )
}
