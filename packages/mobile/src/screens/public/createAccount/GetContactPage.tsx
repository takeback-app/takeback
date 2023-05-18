import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { mask } from 'react-native-mask-text'

import { Button, Heading, Progress, Stack } from 'native-base'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Header } from '../../../components/header'
import { CustomInput } from '../../../components/input'
import { Layout } from '../../../components/layout'
import { useSignUp } from './state'

const schema = z.object({
  email: z.string().email().nonempty({ message: 'E-mail é obrigatório' }),
  phone: z
    .string()
    .nonempty({ message: 'Telefone é obrigatório' })
    .min(16, { message: 'Telefone incompleto' })
})

export type ContactData = z.infer<typeof schema>

export function GetContactPage({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<ContactData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: ContactData) {
    useSignUp.setState(data)

    navigation.navigate('setPasswordPage')
  }

  return (
    <Layout>
      <Progress value={75} size="xs" colorScheme="blue" />
      <Header variant="arrow" goBack={navigation.goBack} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Stack flex="1" justifyContent="space-between" px="4" pb="8" mt="4">
          <ScrollView>
            <Stack flex="1" space="2" mb="4">
              <Heading fontSize="3xl" color="blue.600" fontWeight="bold" mb="4">
                Informe seu e-mail e telefone.
              </Heading>

              <Controller
                control={control}
                name="email"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error }
                }) => (
                  <CustomInput
                    label="E-mail"
                    keyboardAppearance="light"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    maxLength={40}
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
                name="phone"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error }
                }) => (
                  <CustomInput
                    label="Telefone (Com DDD)"
                    keyboardAppearance="light"
                    keyboardType="numeric"
                    maxLength={20}
                    onBlur={onBlur}
                    isInvalid={!!error?.message}
                    error={error?.message}
                    onChangeText={text =>
                      onChange(mask(text, '(99) 9 9999-9999'))
                    }
                    value={value}
                  />
                )}
              />
            </Stack>
          </ScrollView>

          <Button
            h="12"
            mt="4"
            rounded="full"
            bgColor="blue.600"
            _pressed={{
              bgColor: 'blue.400'
            }}
            _text={{
              fontSize: 'md',
              fontWeight: 'medium'
            }}
            isLoading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            Próximo
          </Button>
        </Stack>
      </KeyboardAvoidingView>
    </Layout>
  )
}
