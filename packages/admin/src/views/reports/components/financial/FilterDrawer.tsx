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
import { Order, useFinancialReport } from './state'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'
import { TransactionStatusFilter } from '../../../../components/filters/TransactionStatusFilter'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export enum OrderByColumn {
  TAKEBACK_FEE_VALUE = 'takebackFeeAmount',
  MONTHLY_PAYMENT = 'monthlyPayment',
  CITY_NAME = 'city.name'
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { setForm, dateStart, dateEnd, order, orderBy, reset } =
    useFinancialReport()

  const [localDateStart, setDateStart] = useState(dateStart)
  const [localDateEnd, setDateEnd] = useState(dateEnd)
  const [localOrderBy, setOrderBy] = useState(orderBy)
  const [localOrder, setOrder] = useState(order)
  const [localTransactionStatusId, setTransactionStatusId] = useState(0)
  const [localMonthlyPayment, setMonthlyPayment] = useState('')

  function resetFilter() {
    reset()

    setDateStart(dateStart)
    setDateEnd(dateEnd)
    setOrderBy(orderBy)
    setOrder(order)
    setTransactionStatusId(0)
    setMonthlyPayment('')
  }

  function handleSubmit() {
    if (!localDateStart || !localDateEnd) return
    setForm({
      dateStart: localDateStart,
      dateEnd: localDateEnd,
      orderBy: localOrderBy,
      order: localOrder,
      monthlyPayment: localMonthlyPayment,
      transactionStatusId: localTransactionStatusId || undefined
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
                  { value: 'true', text: 'Pago' },
                  { value: 'false', text: 'Não Pago' }
                ]}
                label="Status da mensalidade"
                name="monthlyPaymentStatus"
                value={String(localMonthlyPayment)}
                onChange={e => setMonthlyPayment(e.target.value)}
              />

              <TransactionStatusFilter
                value={localTransactionStatusId}
                setValue={setTransactionStatusId}
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
                  { value: OrderByColumn.CITY_NAME, text: 'Nome da Cidade' },
                  {
                    value: OrderByColumn.MONTHLY_PAYMENT,
                    text: 'Valor de mensalidade'
                  },
                  {
                    value: OrderByColumn.TAKEBACK_FEE_VALUE,
                    text: 'Valor de taxa'
                  }
                ]}
                label="Ordenar por"
                name="orderBy"
                value={localOrderBy}
                onChange={e => setOrderBy(e.target.value)}
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
