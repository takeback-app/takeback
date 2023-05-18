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
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { ChakraRadio } from '../../../../components/chakra/ChakraRatio'
import { FilterType, useCashConference } from '../state'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { date, setForm, type } = useCashConference()

  const [dayDate, setDayDate] = useState(date)
  const [typeString, setTypeString] = useState(type)

  function handleSubmit() {
    if (!dayDate || !typeString) return

    setForm({
      date: dayDate,
      type: typeString as FilterType
    })

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
            <ChakraInput
              size="sm"
              type="date"
              label="Dia"
              defaultValue={dayDate}
              onChange={e => setDayDate(e.target.value)}
              isRequired
            />

            <ChakraRadio
              label="Status"
              size="sm"
              defaultValue={type}
              onChange={value => setTypeString(value as FilterType)}
              isRequired
            >
              <Radio value="all">Todos</Radio>
              <Radio value="pending">Pendentes</Radio>
              <Radio value="approved">Aprovados</Radio>
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
