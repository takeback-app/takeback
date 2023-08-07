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
import { Order, useClientReport } from './state'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { setForm, firstDate, secondDate, order, orderBy, reset } =
    useClientReport()

  const [startDate, setStartDate] = useState(firstDate)
  const [endDate, setEndDate] = useState(secondDate)
  const [localOrderBy, setOrderBy] = useState(orderBy)
  const [localOrder, setOrder] = useState(order)

  function resetFilter() {
    reset()

    setStartDate(firstDate)
    setEndDate(secondDate)
    setOrderBy(orderBy)
    setOrder(order)
  }

  function handleSubmit() {
    if (!startDate || !endDate) return

    setForm({
      firstDate: startDate,
      secondDate: endDate,
      orderBy: localOrderBy,
      order: localOrder
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
              label="Período inicial"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              isRequired
            />
            <ChakraInput
              size="sm"
              type="date"
              label="Período final"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              isRequired
            />

            <ChakraSelect
              options={[
                { value: 'totalAmount', text: 'Total de compras' },
                { value: 'consumers.fullName', text: 'Nome do cliente' },
                { value: 'cashbackApproved', text: 'Cashbacks Aprovados' },
                { value: 'transactionCount', text: 'Quantidade de Visitas' }
              ]}
              label="Ordenar por"
              name="orderBy"
              value={localOrderBy}
              onChange={e => setOrderBy(e.target.value)}
            />

            <ChakraSelect
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
  )
}
