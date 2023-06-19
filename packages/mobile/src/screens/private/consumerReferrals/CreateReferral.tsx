import React from 'react'

import {
  Box,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  useDisclose,
  useToast
} from 'native-base'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Header } from '../../../components/header'
import { Platform } from 'react-native'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ToastAlert } from '../../../components/ToastAlert'
import { createReferral } from '../../../services'
import { PhoneInput } from '../../../components/form/PhoneInput'
import { Dialog } from '../../../components/dialog'
import { createWhatsAppReferralMessage } from '../../../utils'
import { Layout } from '../../../components/layout'

const schema = z.object({
  phone: z.string().min(14, 'Telefone inválido')
})

type CreateReferralForm = z.infer<typeof schema>

export function CreateReferral({ navigation }) {
  const { isOpen, onClose, onOpen } = useDisclose()
  const toast = useToast()

  const { control, handleSubmit, formState, setError, getValues } =
    useForm<CreateReferralForm>({
      resolver: zodResolver(schema)
    })

  async function onSubmit(data: CreateReferralForm) {
    data.phone = data.phone.replace(/\D/g, '')

    const [isOk, response] = await createReferral({ identifier: data.phone })

    if (!isOk) {
      return setError('phone', { message: response.message })
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

    onOpen()
  }

  function handleConfirm() {
    const phone = getValues('phone').replace(/\D/g, '')

    onClose()

    createWhatsAppReferralMessage(phone)

    navigation.goBack()
  }

  function handleCancel() {
    onClose()
    navigation.goBack()
  }

  return (
    <Layout withoutKeyboardDismiss>
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
          <PhoneInput control={control} />
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
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        confirmTitle="Sim"
        cancelTitle="Não, já avisei meu amigo"
        title="Enviar convite via WhatsApp?"
      />
    </Layout>
  )
}
