import React from 'react'

import {
  Box,
  Button,
  Flex,
  KeyboardAvoidingView,
  ScrollView,
  useToast
} from 'native-base'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Header } from '../../../components/header'
import { CpfInput } from '../../../components/form/CpfInput'
import { Platform } from 'react-native'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { validCpf } from '../../../utils/validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { ToastAlert } from '../../../components/ToastAlert'
import { createReferral } from '../../../services'

const schema = z
  .object({
    cpf: z.string().min(14, 'CPF inválido')
  })
  .refine(({ cpf }) => validCpf(cpf), {
    path: ['cpf'],
    message: 'CPF inválido'
  })

type CreateReferralForm = z.infer<typeof schema>

export function CreateReferral({ navigation }) {
  const toast = useToast()

  const { top, bottom } = useSafeAreaInsets()

  const { control, handleSubmit, formState, setError } =
    useForm<CreateReferralForm>({
      resolver: zodResolver(schema)
    })

  async function onSubmit(data: CreateReferralForm) {
    data.cpf = data.cpf.replace(/\D/g, '')

    const [isOk, response] = await createReferral(data)

    if (!isOk) {
      return setError('cpf', { message: response.message })
    }

    toast.show({
      render: () => (
        <ToastAlert
          status="success"
          title="Sucesso!"
          variant="left-accent"
          description="Indicação realizada com sucesso."
        />
      ),
      duration: 3000
    })

    navigation.goBack()
  }

  return (
    <Flex
      flex={1}
      bg="white"
      style={{ paddingTop: top, paddingBottom: bottom }}
    >
      <Header
        variant="arrow"
        title="Indique e ganhe"
        goBack={navigation.goBack}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView p={4}>
          <CpfInput control={control} />
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
            isLoading={formState.isSubmitting}
          >
            Indicar
          </Button>
        </Box>
      </KeyboardAvoidingView>
    </Flex>
  )
}
