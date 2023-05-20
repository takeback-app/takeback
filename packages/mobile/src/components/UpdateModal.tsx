import React, { useState } from 'react'

import { IModalProps, Modal, Text } from 'native-base'
import { Button } from 'native-base'
import { StatusBar } from 'expo-status-bar'

interface UpdateModalProps extends IModalProps {
  onPress: () => void
}

export function UpdateModal(props: UpdateModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <StatusBar style="dark" />
      <Modal {...props}>
        <Modal.Content maxWidth="400px">
          <Modal.Header>Nova atualização</Modal.Header>
          <Modal.Body>
            <Text>
              É preciso que você atualize o app para continuar utilizando. O app
              irá fechar e abrir novamente, não se preocupe.
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button
              w="full"
              onPress={() => {
                setIsLoading(true)
                props.onPress()
              }}
              isLoading={isLoading}
            >
              Atualizar
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
