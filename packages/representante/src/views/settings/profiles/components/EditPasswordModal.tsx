import React, { useState } from 'react'

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Toast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { ChakraPasswordInput } from '../../../../components/chakra/ChakraPasswordInput'

const schema = z.object({
  password: z.string().nonempty({ message: 'Campo não pode estar em branco' }),
  newPassword: z
    .string()
    .nonempty({ message: 'Campo não pode estar em branco' }),
  confirmNewPassword: z
    .string()
    .nonempty({ message: 'Campo não pode estar em branco' })
})

export type EditPasswordData = z.infer<typeof schema>

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EditPasswordModal({ isOpen, onClose }: AddItemModalProps) {
  const initialRef = React.useRef<HTMLInputElement | null>(null)

  const { control, ...form } = useForm<EditPasswordData>({
    mode: 'onSubmit',
    resolver: zodResolver(schema)
  })

  // const password = useWatch({ control, name: 'password' })
  // const newPassword = useWatch({ control, name: 'newPassword' })
  // const confirmNewPassword = useWatch({ control, name: 'confirmNewPassword' })
  // console.log(password)
  // const {
  //   onSubmit,
  //   // formState: { errors, isSubmitting },
  //   reset
  //   // register
  // } = useForm<EditPasswordData>({
  //   resolver: zodResolver(schema)
  // })

  function onSubmit(data: EditPasswordData) {
    // validateData(data)
    console.log(data)

    // reset()
  }

  async function validateConfirmNewPassword() {
    const newPassword = form.getValues('newPassword')
    const confirmNewPassword = form.getValues('confirmNewPassword')
    // const [isLoading, setIsLoading] = useState(false)

    if (newPassword !== confirmNewPassword) {
      return form.setError('confirmNewPassword', {
        message: 'Nova senha divergente'
      })
    }

    form.clearErrors('newPassword')
    form.clearErrors('confirmNewPassword')

    // if (newPassword !== confirmNewPassword) {
    //   console.log('a')

    //   return form.setError('confirmNewPassword', {
    //     message: 'Nova senha divergente'
    //   })
    // }

    // console.log(password, 's')
  }

  return (
    <Modal
      size="2xl"
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar senha</ModalHeader>
        <ModalCloseButton />
        <form
          style={{ marginBottom: 0 }}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <ModalBody pb={6}>
            <Stack>
              <ChakraPasswordInput
                label="Senha atual"
                size="sm"
                isRequired
                {...form.register('password')}
                // error={errors.description?.message}
              />
              <ChakraPasswordInput
                label="Nova senha"
                size="sm"
                isRequired
                {...form.register('newPassword')}
                // error={errors.description?.message}
              />
              <ChakraPasswordInput
                label="Confirmar senha"
                size="sm"
                isRequired
                onFocus={async () => {
                  // setIsLoading(true)
                  await validateConfirmNewPassword()
                  // setIsLoading(false)
                }}
                {...form.register('confirmNewPassword')}
                // error={errors.description?.message}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              type="submit"
              // isLoading={isSubmitting}
              mr={3}
            >
              Editar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
