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
import { FindDepositsOrderByColumn, Order, useTransfer } from './state'
import moment from 'moment'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { ChakraSelect } from '../../../components/chakra/ChakraSelect'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { setForm, dateStart, dateEnd, order, orderBy, reset } = useTransfer()

  const [localDateStart, setDateStart] = useState(dateStart)
  const [localDateEnd, setDateEnd] = useState(dateEnd)
  const [localOrderBy, setOrderBy] = useState(orderBy)
  const [localOrder, setOrder] = useState(order)
  const [localIsPaid, setIsPaid] = useState('')

  function resetFilter() {
    const resetDateStart = moment().subtract(1, 'month').format('YYYY-MM-DD')
    const resetDateEnd = moment().format('YYYY-MM-DD')
    reset()

    setDateStart(resetDateStart)
    setDateEnd(resetDateEnd)
    setOrderBy(FindDepositsOrderByColumn.CREATED_AT)
    setOrder('desc')
    setIsPaid('')
  }

  function handleSubmit() {
    if (!localDateStart || !localDateEnd) return
    setForm({
      dateStart: localDateStart,
      dateEnd: localDateEnd,
      orderBy: localOrderBy,
      order: localOrder,
      isPaid: localIsPaid || undefined
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
                  { value: 'true', text: 'Sim' },
                  { value: 'false', text: 'Não' }
                ]}
                label="Foi Pago?"
                name="isPaid"
                value={localIsPaid}
                onChange={e => setIsPaid(e.target.value)}
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

              <ChakraSelect
                size="sm"
                options={[
                  { value: FindDepositsOrderByColumn.CREATED_AT, text: 'Data' },
                  { value: FindDepositsOrderByColumn.FULL_NAME, text: 'Nome' },
                  { value: FindDepositsOrderByColumn.VALUE, text: 'Valor' }
                ]}
                label="Ordenar por"
                name="orderBy"
                value={localOrderBy}
                onChange={e =>
                  setOrderBy(e.target.value as FindDepositsOrderByColumn)
                }
              />

              <ChakraSelect
                size="sm"
                options={[
                  { value: 'asc', text: 'Crescente' },
                  { value: 'desc', text: 'Decrescente' }
                ]}
                label="Ordem"
                name="order"
                value={localOrder}
                onChange={e => setOrder(e.target.value as Order)}
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
