import React from 'react'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { chakraToastOptions } from '../../../../components/ui/toast'
import { IoCheckmark } from 'react-icons/io5'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Stack,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { confirmDelivery } from '../services/api'
import { mutate } from 'swr'

interface ConfirmationDeliveryButtonProps {
  id: string
  mutateKey: string
}

const schema = z.object({
  userCode: z.string().nonempty('Campo obrigatório')
})

export type ConfirmDeliveryData = z.infer<typeof schema>

export function ConfirmationDeliveryButton({
  id,
  mutateKey
}: ConfirmationDeliveryButtonProps) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast(chakraToastOptions)
  const cancelRef = React.useRef(null)
  const { register, formState, handleSubmit } = useForm<ConfirmDeliveryData>({
    resolver: zodResolver(schema)
  })

  async function onSubmit(data: ConfirmDeliveryData) {
    const [isOk, response] = await confirmDelivery(id, data)

    if (!isOk) {
      return toast({
        title: 'Ops :(',
        description: response.message,
        status: 'error'
      })
    }

    mutate(mutateKey)

    onClose()

    toast({
      title: 'Sucesso!',
      description: response.message,
      status: 'success'
    })
  }

  return (
    <>
      <Button
        colorScheme="green"
        variant="ghost"
        aria-label="add-item"
        size="sm"
        rounded="full"
        leftIcon={<IoCheckmark size={20} />}
        onClick={onOpen}
      >
        Confirmar entrega
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          if (formState.isSubmitting) return

          onClose()
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Entrega do prêmio
              </AlertDialogHeader>

              <AlertDialogBody>
                <Stack spacing={4}>
                  <ChakraInput
                    label="Código de confirmação do usuário"
                    size="sm"
                    isRequired
                    error={formState.errors.userCode?.message}
                    {...register('userCode')}
                  />
                </Stack>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={onClose}
                  isDisabled={formState.isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  colorScheme="green"
                  type="submit"
                  isLoading={formState.isSubmitting}
                  ml={3}
                >
                  Autorizar
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
