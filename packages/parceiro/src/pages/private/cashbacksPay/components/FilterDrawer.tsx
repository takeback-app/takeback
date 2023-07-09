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
import { FilterType, useCashbackPay } from '../state'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { setForm, type } = useCashbackPay()

  const [typeString, setTypeString] = useState(type)

  function handleSubmit() {
    if (!typeString) return

    setForm({ type: typeString as FilterType })

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
              onChange={value => setTypeString(value as FilterType)}
              isRequired
            >
              <Stack>
                <Radio value="ALL">Todos</Radio>
                <Radio value="VALIDATED">Validado</Radio>
                <Radio value="IN_PROGRESS">Em processamento</Radio>
                <Radio value="NOT_FOUND">Não encontrado</Radio>
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
