import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { mask, unMask } from 'react-native-mask-text'

import { Button, Heading, Progress, Stack, Text } from 'native-base'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Header } from '../../../components/header'
import { CustomInput } from '../../../components/input'
import { Layout } from '../../../components/layout'

import { CPFValidate } from '../../../utils/CPFValidate'
import { checkCpf } from '../../../services'
import { useSignUp } from './state'

const schema = z.object({
  cpf: z
    .string()
    .nonempty({ message: 'CPF é obrigatório' })
    .min(14, { message: 'CPF incompleto' })
})

export type CpfData = z.infer<typeof schema>

export function GetCpfPage({ navigation }) {
  const { setValue } = useSignUp()

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting }
  } = useForm<CpfData>({ resolver: zodResolver(schema) })

  function navigateToWelcome() {
    navigation.navigate('welcome')
  }

  async function onSubmit({ cpf }: CpfData) {
    const unmaskedCpf = unMask(cpf)

    if (!CPFValidate(unmaskedCpf)) {
      return setError('cpf', { message: 'CPF incorreto' })
    }

    const [isOk, response] = await checkCpf(unmaskedCpf)

    if (!isOk) {
      return setError('cpf', { message: response.message })
    }

    setValue('cpf', unmaskedCpf)

    navigation.navigate('getDataPage')
  }

  return (
    <Layout>
      <Progress value={25} size="xs" colorScheme="blue" />
      <Header variant="close" goBack={navigateToWelcome} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Stack flex="1" px="4" pb="8" justifyContent="space-between">
          <Stack mt="4" space="2">
            <Heading fontSize="3xl" color="blue.600" fontWeight="bold">
              Vamos criar a sua conta! Primeiro, informe seu CPF.
            </Heading>
            <Text fontSize="md" color="gray.600" fontWeight="medium" mb="4">
              O seu CPF é utilizado apenas para garantir que é você mesmo.
            </Text>

            <Controller
              control={control}
              name="cpf"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error }
              }) => (
                <CustomInput
                  label="CPF"
                  keyboardType="numeric"
                  keyboardAppearance="light"
                  maxLength={14}
                  autoFocus={true}
                  onBlur={onBlur}
                  isInvalid={!!error?.message}
                  error={error?.message}
                  onChangeText={e => onChange(mask(e, '999.999.999-99'))}
                  value={value}
                />
              )}
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
