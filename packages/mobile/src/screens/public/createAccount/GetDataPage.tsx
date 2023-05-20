import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { mask, unMask } from 'react-native-mask-text'

import {
  Button,
  FormControl,
  Heading,
  Progress,
  Radio,
  Stack,
  WarningOutlineIcon
} from 'native-base'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Header } from '../../../components/header'
import { CustomInput } from '../../../components/input'
import { Layout } from '../../../components/layout'
import { Sex, useSignUp } from './state'
import { validateCEP } from '../../../services'
import { isValidBirthDate } from '../../../utils/birthdayValidator'

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Nome é obrigatório' })
    .min(5, { message: 'Informe seu nome completo' }),
  sex: z.enum(['MALE', 'FEMALE']),
  birthday: z
    .string()
    .nonempty({ message: 'Data de Nascimento é obrigatório' })
    .min(10, { message: 'Data incompleta' }),
  zipCode: z
    .string()
    .nonempty({ message: 'CEP é obrigatório' })
    .min(9, { message: 'Informe o CEP da sua cidade' })
})

export type Data = z.infer<typeof schema>

export function GetDataPage({ navigation }) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting }
  } = useForm<Data>({ resolver: zodResolver(schema) })

  async function onSubmit({ birthday, name, sex, zipCode }: Data) {
    if (!isValidBirthDate(birthday)) {
      return setError('birthday', { message: 'Data inválida' })
    }

    const unmaskedZipCode = unMask(zipCode)

    const [isOk, response] = await validateCEP(unmaskedZipCode)

    if (!isOk) {
      return setError('zipCode', { message: response.message })
    }

    useSignUp.setState({
      birthday,
      name,
      zipCode: unmaskedZipCode,
      sex: sex as Sex
    })

    navigation.navigate('getContactsPage')
  }

  return (
    <Layout>
      <Progress value={50} size="xs" colorScheme="blue" />
      <Header variant="arrow" goBack={navigation.goBack} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Stack flex="1" justifyContent="space-between" px="4" pb="8" mt="4">
          <ScrollView>
            <Heading fontSize="3xl" color="blue.600" fontWeight="bold" mb="4">
              Nos conte um pouco mais sobre você.
            </Heading>
            <Stack flex="1" space="8" mt="4">
              <Controller
                control={control}
                name="name"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error }
                }) => (
                  <CustomInput
                    label="Nome completo"
                    keyboardType="default"
                    autoCapitalize="words"
                    keyboardAppearance="light"
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
                name="sex"
                render={({
                  field: { onChange, value, name },
                  fieldState: { error }
                }) => (
                  <FormControl isInvalid={!!error?.message}>
                    <FormControl.Label fontWeight="medium">
                      Sexo
                    </FormControl.Label>
                    <Radio.Group
                      name={name}
                      accessibilityLabel="Sexo"
                      value={value}
                      onChange={value => onChange(value as Sex)}
                    >
                      <Stack direction="row" space={2}>
                        <Radio value="MALE">Masculino</Radio>
                        <Radio value="FEMALE">Feminino</Radio>
                      </Stack>
                    </Radio.Group>
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {error?.message}
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="zipCode"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error }
                }) => (
                  <CustomInput
                    label="CEP da sua cidade"
                    keyboardAppearance="light"
                    keyboardType="numeric"
                    maxLength={9}
                    onBlur={onBlur}
                    isInvalid={!!error?.message}
                    error={error?.message}
                    onChangeText={text => onChange(mask(text, '99999-999'))}
                    value={value}
                  />
                )}
              />

              <Controller
                control={control}
                rules={{ required: 'O campo é obrigatório' }}
                name="birthday"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error }
                }) => (
                  <>
                    <CustomInput
                      label="Data de Nascimento"
                      keyboardAppearance="light"
                      keyboardType="numeric"
                      maxLength={10}
                      onBlur={onBlur}
                      onChangeText={text => onChange(mask(text, '99/99/9999'))}
                      isInvalid={!!error?.message}
                      error={error?.message}
                      value={value}
                    />
                  </>
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
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            Próximo
          </Button>
        </Stack>
      </KeyboardAvoidingView>
    </Layout>
  )
}
