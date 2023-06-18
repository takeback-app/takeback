import React from 'react'

import {
  Button,
  ButtonGroup,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'

const schema = z.object({
  file: z.instanceof(FileList)
})

export type LogoChangeCreateItemData = z.infer<typeof schema>

interface CreateModalProps {
  isDisabled?: boolean
  onSubmitNewLogo: (data: LogoChangeCreateItemData) => void
}

export function CreateModal({
  isDisabled = false,
  onSubmitNewLogo
}: CreateModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [logoUrl, setLogoUrl] = React.useState<string>('')

  const initialRef = React.useRef<HTMLInputElement | null>(null)

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    register
  } = useForm<LogoChangeCreateItemData>({
    resolver: zodResolver(schema)
  })

  function onSubmit(data: LogoChangeCreateItemData) {
    onSubmitNewLogo(data)
    onClose()
    reset()
  }

  return (
    <>
      <Button colorScheme="blue" isDisabled={isDisabled} onClick={onOpen}>
        Criar
      </Button>
      <Modal
        size="2xl"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Trocar Logo</ModalHeader>
          <ModalCloseButton />
          <form style={{ marginBottom: 0 }} onSubmit={handleSubmit(onSubmit)}>
            <ModalBody pb={6}>
              <Image
                border="2px"
                borderColor="gray.400"
                shadow="lg"
                objectFit="cover"
                borderRadius="lg"
                w={48}
                h={48}
                mb={8}
                src={logoUrl}
                fallbackSrc="https://via.placeholder.com/320"
              />
              <Stack>
                <ChakraInput
                  label="Logo"
                  size="sm"
                  type="file"
                  isRequired
                  accept="image/*"
                  error={errors.file?.message}
                  {...register('file', {
                    onChange: e => {
                      setLogoUrl(URL.createObjectURL(e.target.files[0]))
                    }
                  })}
                />
              </Stack>
            </ModalBody>

            <ModalFooter>
              <ButtonGroup>
                <Button onClick={onClose}>Cancelar</Button>

                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Solicitar
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
