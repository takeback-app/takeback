import React, { useRef } from 'react'
import { AlertDialog, Button, Text } from 'native-base'

interface DialogProps {
  title?: string
  isOpen?: boolean
  onConfirm?: () => void
}

export function SuccessDialog(props: DialogProps) {
  const cancelRef = useRef(null)

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={props.isOpen}>
      <AlertDialog.Content>
        <AlertDialog.Header borderColor="transparent">
          <Text fontSize="md" fontWeight="medium" color="gray.800">
            {props.title}
          </Text>
        </AlertDialog.Header>
        <AlertDialog.Footer borderColor="transparent">
          <Button.Group space={2}>
            <Button
              bgColor="blue.600"
              px="6"
              rounded="md"
              onPress={props.onConfirm}
              _text={{
                fontWeight: 'medium'
              }}
            >
              Concluir
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}
