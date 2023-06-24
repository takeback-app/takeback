import React from 'react'

import {
  Button,
  Heading,
  Pressable,
  Progress,
  Stack,
  Text,
  useDisclose
} from 'native-base'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

import { Header } from '../../../components/header'
import { CustomInput } from '../../../components/input'
import { Layout } from '../../../components/layout'
import { TermsOfUse } from './components/termsOfUse'

import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignUp } from './state'
import { createAccount } from '../../../services'
import { authenticate } from '../../../utils/authenticate'

const schema = z
  .object({
    password: z.string().nonempty({ message: 'Senha é obrigatória' }),
    passwordConfirmation: z
      .string()
      .nonempty({ message: 'Confirmação de senha é obrigatório' })
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'Senhas não batem',
    path: ['passwordConfirmation']
  })

export type PasswordData = z.infer<typeof schema>

export function SetPasswordPage({ navigation }) {
  const { getFormData, reset } = useSignUp()

  const { isOpen, onClose, onOpen } = useDisclose()

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting }
  } = useForm<PasswordData>({ resolver: zodResolver(schema) })

  async function onSubmit({ password }: PasswordData) {
    const formData = getFormData()

    const [isOk, response] = await createAccount({
      ...formData,
      password
    })

    if (!isOk) {
      return setError('passwordConfirmation', { message: response.message })
    }

    authenticate(response.token, response.refreshToken, true)

    reset()

    navigation.navigate('signUpSuccess')
  }

  return (
    <Layout>
      <Progress value={100} size="xs" colorScheme="blue" />
      <Header variant="arrow" goBack={navigation.goBack} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Stack flex="1" justifyContent="space-between" px="4" pb="8" mt="4">
          <ScrollView>
            <Stack flex="1" space="2" mb="4">
              <Heading fontSize="3xl" color="blue.600" fontWeight="bold">
                Crie uma senha segura com seis números.
              </Heading>

              <Controller
                control={control}
                name="password"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error }
                }) => (
                  <CustomInput
                    label="Senha"
                    keyboardAppearance="light"
                    keyboardType="numeric"
                    maxLength={6}
                    isPassword
                    autoFocus={true}
                    onBlur={onBlur}
                    isInvalid={!!error?.message}
                    error={error?.message}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />

              <Controller
                control={control}
                name="passwordConfirmation"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error }
                }) => (
                  <CustomInput
                    label="Confirme a senha"
                    keyboardAppearance="light"
                    keyboardType="numeric"
                    maxLength={6}
                    isPassword
                    onBlur={onBlur}
                    isInvalid={!!error?.message}
                    error={error?.message}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </Stack>
          </ScrollView>

          <Stack>
            <Pressable
              p="0"
              m="0"
              mb="4"
              onPress={onOpen}
              isDisabled={isSubmitting}
            >
              <Text
                fontSize="md"
                color="gray.600"
                fontWeight="medium"
                textAlign="center"
              >
                Ao criar sua conta você concorda com os{' '}
                <Text
                  fontSize="md"
                  color="blue.600"
                  fontWeight="medium"
                  textAlign="center"
                >
                  Termos de Uso
                </Text>
              </Text>
            </Pressable>
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
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
            >
              Criar conta
            </Button>
          </Stack>
        </Stack>
      </KeyboardAvoidingView>

      <TermsOfUse modalVisible={isOpen} onClose={onClose} />
    </Layout>
  )
}
