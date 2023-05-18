import React from 'react'

import { Container, Content, Message, CloseIcon } from './styles'

interface Props {
  visible?: boolean
  message?: string
  onSave?: () => void
  onClose: () => void
}

export const ModalError: React.FC<Props> = ({
  visible,
  message,
  onClose,
  onSave
}) => {
  return (
    <Container visible={visible}>
      <Content>
        <CloseIcon onClick={onClose} />
        <Message>{message}</Message>
      </Content>
    </Container>
  )
}
