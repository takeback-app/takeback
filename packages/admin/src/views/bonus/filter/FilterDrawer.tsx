import React, { useState } from 'react'

import {
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Stack
} from '@chakra-ui/react'
import { useExtract } from './state'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { ChakraSelect } from '../../../components/chakra/ChakraSelect'
import moment from 'moment'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { setForm, dateStart, dateEnd, bonusType, reset } = useExtract()

  const [localDateStart, setDateStart] = useState(dateStart)
  const [localDateEnd, setDateEnd] = useState(dateEnd)
  const [localBonusType, setBonusType] = useState('')

  function resetFilter() {
    const resetDateStart = moment().subtract(1, 'month').format('YYYY-MM-DD')
    const resetDateEnd = moment().format('YYYY-MM-DD')
    reset()

    setDateStart(resetDateStart)
    setDateEnd(resetDateEnd)
    setBonusType('')
  }

  function handleSubmit() {
    if (!localDateStart || !localDateEnd) return
    setForm({
      dateStart: localDateStart,
      dateEnd: localDateEnd,
      bonusType: localBonusType
    })

    onClose()
  }

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filtros</DrawerHeader>

          <DrawerBody>
            <Stack spacing={6}>
              <ChakraSelect
                size="sm"
                options={[
                  { value: '', text: 'Todos' },
                  { value: 'SELL', text: 'Venda' },
                  { value: 'NEW_USER', text: 'Novo Usuário' },
                  { value: 'CONSULTANT', text: 'Representante' },
                  { value: 'REFERRAL', text: 'Indicação' }
                ]}
                label="Tipo"
                name="bonusType"
                value={localBonusType}
                onChange={e => setBonusType(e.target.value)}
              />

              <ChakraInput
                size="sm"
                type="date"
                label="Período inicial"
                value={localDateStart}
                onChange={e => setDateStart(e.target.value)}
                isRequired
              />
              <ChakraInput
                size="sm"
                type="date"
                label="Período final"
                value={localDateEnd}
                onChange={e => setDateEnd(e.target.value)}
                isRequired
              />
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <ButtonGroup>
              <Button onClick={resetFilter}>Limpar Filtros</Button>
              <Button colorScheme="twitter" onClick={handleSubmit}>
                Buscar
              </Button>
            </ButtonGroup>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
