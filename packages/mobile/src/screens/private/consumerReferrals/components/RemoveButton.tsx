import React from 'react'
import { IconButton, useDisclose, useToast } from 'native-base'
import { Dialog } from '../../../../components/dialog'
import { Ionicons } from '@expo/vector-icons'
import { deleteReferral } from '../../../../services'
import { ToastAlert } from '../../../../components/ToastAlert'

interface RemoveButtonProps {
  id: string
  onDeleted: () => void
}

export function RemoveButton({ id, onDeleted }: RemoveButtonProps) {
  const toast = useToast()

  const { isOpen, onClose, onOpen } = useDisclose()

  async function handleRemove() {
    const [isOk, response] = await deleteReferral(id)

    if (!isOk) {
      toast.show({
        render: () => (
          <ToastAlert
            status="error"
            title="Erro!"
            variant="left-accent"
            description={response.message}
          />
        ),
        duration: 3000
      })
    }

    await onDeleted()

    onClose()
  }

  return (
    <>
      <IconButton
        rounded="full"
        variant="ghost"
        colorScheme="red"
        aria-label="open menu"
        onPress={onOpen}
        _icon={{
          as: Ionicons,
          name: 'remove-circle'
        }}
      />
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleRemove}
        confirmColor="red.600"
        confirmTitle="Sim"
        cancelTitle="Não"
        title="Deseja remover essa indicação"
      />
    </>
  )
}
