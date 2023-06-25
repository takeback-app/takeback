import React from 'react'

import { IModalProps, Modal, Stack, Text } from 'native-base'
import { Button } from 'native-base'

interface ExpireBalanceInfoModalProps extends IModalProps {
  onPress: () => void
}

export function ExpireBalanceInfoModal({
  onPress,
  ...rest
}: ExpireBalanceInfoModalProps) {
  return (
    <Modal {...rest}>
      <Modal.Content maxWidth="400px">
        <Modal.Header>O CASHBACK EXPIRA?</Modal.Header>
        <Modal.Body>
          <Stack space={2}>
            <Text>
              Seu saldo expira apenas com uma inatividade TOTAL de 4 meses sem
              ganhar ou gastar cashbacks.
            </Text>

            <Text>
              Ou seja, cada vez que você movimenta o TakeBack (ganha cashback ou
              usa seu saldo) a data de expiração é prolongada novamente.
            </Text>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button w="full" onPress={onPress}>
            OK
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
