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

export function BlockModal({ isOpen }: { isOpen: boolean }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => ({})}
      size="2xl"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <Alert
          status="error"
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
            Sem permissão para realizar venda
          </AlertTitle>
          <AlertDescription maxWidth="md">
            Realize o pagamento dos cashbacks em atraso ou entre em contato com
            a Takeback para resolver a situação
          </AlertDescription>
        </Alert>
      </ModalContent>
    </Modal>
  )
}
