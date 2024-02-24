import React, { useState } from 'react'

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Radio,
  Stack
} from '@chakra-ui/react'
import { ChakraRadio } from '../../../../components/chakra/ChakraRatio'
import { FilterIsActive, useUserCompanyActivated } from './state'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { setForm, type } = useUserCompanyActivated()

  const [typeString, setTypeString] = useState(type)

  function handleSubmit() {
    if (!typeString) return

    setForm({ type: typeString as FilterIsActive })

    onClose()
  }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Filtros</DrawerHeader>

        <DrawerBody>
          <Stack spacing={6}>
            <ChakraRadio
              label="Status"
              size="sm"
              defaultValue={type}
              onChange={value => setTypeString(value as FilterIsActive)}
              isRequired
            >
              <Stack>
                <Radio value="ACTIVATED">Ativos</Radio>
                <Radio value="ALL">Todos</Radio>
              </Stack>
            </ChakraRadio>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button colorScheme="teal" onClick={handleSubmit}>
            Buscar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
