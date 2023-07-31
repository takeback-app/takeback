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
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { IoCheckmark } from 'react-icons/io5'
import { mutate } from 'swr'
import { z } from 'zod'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { chakraToastOptions } from '../../../../components/ui/toast'
import { confirmWithdrawal } from '../services/api'

interface Props {
  id: string
}

const schema = z.object({
  code: z.string().nonempty('Campo obrigatório')
})

export type ConfirmWithdrawalData = z.infer<typeof schema>

export function ConfirmationWithdrawalButton({ id }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast(chakraToastOptions)
  const cancelRef = React.useRef(null)
  const { register, formState, handleSubmit } = useForm<ConfirmWithdrawalData>({
    resolver: zodResolver(schema)
  })

  async function onSubmit(data: ConfirmWithdrawalData) {
    const [isOk, response] = await confirmWithdrawal(id, data)

    if (!isOk) {
      return toast({
        title: 'Ops :(',
        description: response.message,
        status: 'error'
      })
    }

    mutate('company/store/orders')

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
        Confirmar retirada
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
                Entrega da compra
              </AlertDialogHeader>

              <AlertDialogBody>
                <Stack spacing={4}>
                  <ChakraInput
                    label="Código de confirmação do usuário"
                    size="sm"
                    isRequired
                    error={formState.errors.code?.message}
                    {...register('code')}
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
