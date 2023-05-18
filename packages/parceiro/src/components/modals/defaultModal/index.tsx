import React, { ReactNode } from 'react'
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'

import * as S from './styles'
interface PropsForm {
  newPassword?: string
  confirmPassword?: string
  generatePassword?: boolean
}
interface Props {
  title?: string
  visible: boolean
  onClose: () => void
  data?: PropsForm | undefined
  children: ReactNode
}

export const DefaultModal: React.FC<Props> = ({
  title,
  visible,
  onClose,
  children
}) => {
  return (
    <Modal isOpen={visible} isCentered size="xl" onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <S.Content>
          <S.Header>
            <S.Title>{title}</S.Title>
            <S.CloseIcon onClick={onClose} />
          </S.Header>
          <S.Main>{children}</S.Main>
        </S.Content>
      </ModalContent>
    </Modal>
  )
}
