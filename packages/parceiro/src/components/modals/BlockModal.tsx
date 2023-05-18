import React from 'react'

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Modal,
  ModalContent,
  ModalOverlay
} from '@chakra-ui/react'

interface BlockModalProps {
  isOpen: boolean
  title: string
  status?: 'error' | 'success' | 'warning' | 'info'
  hasBlur?: boolean
  subtitle?: string
}

export function BlockModal({
  isOpen,
  title,
  status = 'error',
  hasBlur = false,
  subtitle
}: BlockModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => ({})}
      size="2xl"
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter={hasBlur ? 'blur(10px)' : undefined} />
      <ModalContent>
        <Alert
          status={status}
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          rounded="lg"
        >
          <CloseButton
            alignSelf="flex-start"
            position="absolute"
            right={3}
            top={3}
            onClick={() => window.location.reload()}
          />
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {title}
          </AlertTitle>
          <AlertDescription maxWidth="md">
            {subtitle ||
              'Realize o pagamento dos cashbacks em atraso ou entre em contato com a Takeback para resolver a situação'}
          </AlertDescription>
        </Alert>
      </ModalContent>
    </Modal>
  )
}
