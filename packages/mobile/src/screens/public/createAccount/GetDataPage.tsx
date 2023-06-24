import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useForm } from 'react-hook-form'
import { unMask } from 'react-native-mask-text'

import { Button, Heading, Progress, Stack } from 'native-base'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Header } from '../../../components/header'
import { Layout } from '../../../components/layout'
import { Sex, useSignUp } from './state'
import { validateCEP } from '../../../services'
import { isValidBirthDate } from '../../../utils/birthdayValidator'
import { NameInput } from '../../../components/form/NameInput'
import { SexInput } from '../../../components/form/SexInput'
import { BirthdayInput } from '../../../components/form/BirthdayInput'
import { ZipCodeInput } from '../../../components/form/ZipCodeInput'
import { MaritalStatusInput } from '../../../components/form/MaritalStatusInput'
import { SchoolingInput } from '../../../components/form/SchoolingInput'
import { MonthlyIncomeInput } from '../../../components/form/MonthlyIncomeInput'
import { HasChildrenInput } from '../../../components/form/HasChildrenInput'

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Nome é obrigatório' })
    .min(5, { message: 'Informe seu nome completo' }),
  sex: z.enum(['MALE', 'FEMALE']),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED']),
  schooling: z.enum([
    'GRADUATED',
    'COMPLETE_HIGH_SCHOOL',
    'COMPLETE_PRIMARY_EDUCATION',
    'ILLITERATE'
  ]),
  monthlyIncomeId: z.string().nonempty({ message: 'Renda é obrigatório' }),
  hasChildren: z.enum(['sim', 'não']),
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

  async function onSubmit({
    birthday,
    name,
    sex,
    zipCode,
    hasChildren,
    maritalStatus,
    monthlyIncomeId,
    schooling
  }: Data) {
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
      sex: sex as Sex,
      hasChildren,
      maritalStatus,
      monthlyIncomeId,
      schooling
    })

    navigation.navigate('getContactsPage')
  }

  return (
    <Layout withoutKeyboardDismiss>
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
            <Stack flex="1" space="8" my="4">
              <NameInput control={control} />
              <SexInput control={control} />
              <ZipCodeInput control={control} />
              <BirthdayInput control={control} />
              <MaritalStatusInput control={control} />
              <SchoolingInput control={control} />
              <MonthlyIncomeInput control={control} />
              <HasChildrenInput control={control} />
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
