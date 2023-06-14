import React, { useRef } from 'react'
import { AlertDialog, Button, Text } from 'native-base'

interface DialogProps {
  title?: string
  isOpen?: boolean
  confirmTitle?: string
  cancelTitle?: string
  hideCancelTitle?: boolean
  confirmColor?: string
  onClose?: () => void
  onCancel?: () => void
  onConfirm?: () => void
}

export function Dialog(props: DialogProps) {
  const cancelRef = useRef(null)

  return (
    <AlertDialog
      size="xl"
      leastDestructiveRef={cancelRef}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <AlertDialog.Content>
        <AlertDialog.Header borderColor="transparent">
          <Text fontSize="md" fontWeight="medium" color="gray.800">
            {props.title}
          </Text>
        </AlertDialog.Header>
        <AlertDialog.Footer borderColor="transparent">
          <Button.Group space={2}>
            {!props.hideCancelTitle ? (
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={props.onCancel ? props.onCancel : props.onClose}
                ref={cancelRef}
                _text={{
                  fontWeight: 'medium'
                }}
              >
                {props.cancelTitle ? props.cancelTitle : 'Cancelar'}
              </Button>
            ) : (
              <></>
            )}
            <Button
              bgColor={props.confirmColor ? props.confirmColor : 'blue.600'}
              px="6"
              rounded="md"
              onPress={props.onConfirm}
              _text={{
                fontWeight: 'medium'
              }}
            >
              {props.confirmTitle ? props.confirmTitle : 'Confirmar'}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}
