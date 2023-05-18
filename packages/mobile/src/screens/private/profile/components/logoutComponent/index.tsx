import React, { useContext, useRef, useState } from 'react'
import { AlertDialog, Button, Text } from 'native-base'

import { AuthContext } from '../../../../../contexts/AuthContext'
import { Info } from '../info'
import { signOut } from '../../../../../utils/signOut'

export function LogoutComponent() {
  const cancelRef = useRef(null)
  const { setIsSignedIn } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)

  async function handleLogout() {
    await signOut()

    setIsSignedIn(false)
    setIsOpen(false)
  }

  return (
    <>
      <Info
        title="Sair do aplicativo"
        borderB
        value=""
        onPress={() => setIsOpen(true)}
      />

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton color="gray.800" />
          <AlertDialog.Header borderColor="transparent">
            <Text fontSize="md" fontWeight="medium" color="gray.800">
              Deseja sair do aplicativo?
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Footer borderColor="transparent">
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => setIsOpen(false)}
                ref={cancelRef}
                _text={{
                  fontWeight: 'medium'
                }}
              >
                Cancelar
              </Button>
              <Button
                bgColor="red.500"
                px="6"
                rounded="md"
                onPress={handleLogout}
                _text={{
                  fontWeight: 'medium'
                }}
              >
                Sair
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  )
}
