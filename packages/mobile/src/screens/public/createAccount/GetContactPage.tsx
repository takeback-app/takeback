import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

import { Button, Heading, Progress, Stack } from 'native-base'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Header } from '../../../components/header'
import { Layout } from '../../../components/layout'
import { useSignUp } from './state'
import { PhoneInput } from '../../../components/form/PhoneInput'
import { EmailInput } from '../../../components/form/EmailInput'

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
              <EmailInput control={control} />
              <PhoneInput control={control} />
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
