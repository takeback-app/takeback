import React from 'react'

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'

const schema = z.object({
  description: z.string(),
  file: z.instanceof(FileList)
})

export type RaffleCreateItemData = z.infer<typeof schema>

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitNewItem: (data: RaffleCreateItemData) => void
}

export function AddItemModal({
  isOpen,
  onClose,
  onSubmitNewItem
}: AddItemModalProps) {
  const initialRef = React.useRef<HTMLInputElement | null>(null)

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    register
  } = useForm<RaffleCreateItemData>({
    resolver: zodResolver(schema)
  })

  function onSubmit(data: RaffleCreateItemData) {
    onSubmitNewItem(data)
    reset()
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
        <ModalHeader>Adicionar Prêmio</ModalHeader>
        <ModalCloseButton />
        <form style={{ marginBottom: 0 }} onSubmit={handleSubmit(onSubmit)}>
          <ModalBody pb={6}>
            <Stack>
              <ChakraInput
                label="Descrição"
                size="sm"
                isRequired
                maxLength={30}
                error={errors.description?.message}
                {...register('description')}
              />

              <ChakraInput
                label="Imagem do prêmio"
                size="sm"
                type="file"
                isRequired
                accept="image/*"
                error={errors.file?.message}
                {...register('file')}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
              mr={3}
            >
              Criar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
