import React from 'react'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
interface Props {
  children: React.ReactNode
  title?: string
  visible?: boolean
  size?: 'extrasmall' | 'small' | 'medium' | 'large' | 'xLarge'
  onClose?: () => void
}

const sizes = {
  extrasmall: 'sm',
  small: 'md',
  medium: 'lg',
  large: 'xl',
  xLarge: '2xl'
}

export function DefaultModalChakra({
  title = '',
  visible = false,
  onClose = () => ({}),
  size = 'medium',
  children
}: Props) {
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={visible}
      onClose={onClose}
      size={sizes[size]}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  )
}
