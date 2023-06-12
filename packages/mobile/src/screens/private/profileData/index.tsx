import React from 'react'
import { Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native'

import {
  ScrollView,
  Button,
  Stack,
  Center,
  Heading,
  Box,
  useToast
} from 'native-base'
import { unMask } from 'react-native-mask-text'
import { useForm, useFormState } from 'react-hook-form'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'

import { axiosFetcher } from '../../../services/API'

import { NameInput } from '../../../components/form/NameInput'
import { CpfInput } from '../../../components/form/CpfInput'
import { PhoneInput } from '../../../components/form/PhoneInput'
import { SexInput } from '../../../components/form/SexInput'
import { BirthdayInput } from '../../../components/form/BirthdayInput'
import { MaritalStatusInput } from '../../../components/form/MaritalStatusInput'
import { SchoolingInput } from '../../../components/form/SchoolingInput'
import { MonthlyIncomeInput } from '../../../components/form/MonthlyIncomeInput'
import { HasChildrenInput } from '../../../components/form/HasChildrenInput'
import { ZipCodeInput } from '../../../components/form/ZipCodeInput'
import { GenericInput } from '../../../components/form/GenericInput'

import { isValidBirthDate } from '../../../utils/birthdayValidator'
import { updateAccount } from '../../../services'
import { ToastAlert } from '../../../components/ToastAlert'

export type UpdateProfileData = {
  name: string
  cpf?: string
  sex: string
  birthday: string
  hasChildren: string
  maritalStatus: string
  monthlyIncomeId: string
  schooling: string
  phone: string
  address: {
    street: string
    district: string
    number: string
    city?: string
    zipCode: string
    complement: string
  }
}

export function ProfileData({ navigation }) {
  const toast = useToast()

  const { control, handleSubmit, setError, setFocus } =
    useForm<UpdateProfileData>({
      defaultValues: async () => axiosFetcher('costumer/me')
    })
  const { isSubmitting, isLoading } = useFormState({ control })

  async function onSubmit(data: UpdateProfileData) {
    if (!isValidBirthDate(data.birthday)) {
      setFocus('birthday')
      return setError('birthday', { message: 'Data inválida' })
    }

    delete data.address.city
    delete data.cpf

    data.phone = unMask(data.phone)
    data.address.zipCode = unMask(data.address.zipCode)

    const [isOk, response] = await updateAccount(data)

    if (!isOk) {
      return setError('name', { message: response.message })
    }

    toast.show({
      render: () => (
        <ToastAlert
          status="success"
          title="Prontinho! 😉"
          variant="left-accent"
          description="Seus dados foram atualizados com sucesso!"
        />
      ),
      duration: 3000
    })
  }

  if (isLoading) {
    return (
      <Center flex={1} bg="white">
        <ActivityIndicator size="large" color="#449FE7" />
      </Center>
    )
  }

  return (
    <Layout>
      <Header
        title="Dados pessoais"
        variant="arrow"
        goBack={navigation.goBack}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView p={4}>
          <Heading size="md" mb={2}>
            Dados Pessoais
          </Heading>
          <Stack space={4}>
            <NameInput control={control} />
            <CpfInput isDisabled control={control} />
            <PhoneInput control={control} />
            <SexInput control={control} />
            <BirthdayInput control={control} />
            <MaritalStatusInput control={control} />
            <SchoolingInput control={control} />
            <MonthlyIncomeInput control={control} />
            <HasChildrenInput control={control} />
          </Stack>

          <Heading size="md" mb={2} mt={6}>
            Endereço
          </Heading>
          <Stack space={4}>
            {/* <GenericInput label="Rua" name="address.street" control={control} />
            <GenericInput
              label="Bairro"
              name="address.district"
              control={control}
            />
            <GenericInput
              label="Número"
              name="address.number"
              control={control}
            />
            <GenericInput
              label="Complemento"
              name="address.complement"
              control={control}
            /> */}
            <ZipCodeInput name="address.zipCode" control={control} />
            <GenericInput
              label="Cidade"
              name="address.city"
              control={control}
              isDisabled
            />
          </Stack>
          <Box p={4} />
        </ScrollView>
        <Box p={4}>
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
            Atualizar
          </Button>
        </Box>
      </KeyboardAvoidingView>
    </Layout>
  )
}
