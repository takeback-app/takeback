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
import { ChakraInput } from '../../../../../components/chakra/ChakraInput'
import { ChakraSelect } from '../../../cashRegister/components/ChakraSelect'
import { Order, useCashbackReport } from './state'
import useSWR from 'swr'

export interface PaymentMethods {
  id: number
  description: string
}

interface CashbackStatuses {
  id: number
  description: string
}

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const {
    setForm,
    firstDate,
    secondDate,
    order,
    orderBy,
    paymentMethod,
    statusTransaction,
    reset
  } = useCashbackReport()

  const [startDate, setStartDate] = useState(firstDate)
  const [endDate, setEndDate] = useState(secondDate)
  const [localOrderBy, setOrderBy] = useState(orderBy)
  const [localOrder, setOrder] = useState(order)
  const [payment, setPaymentMethod] = useState(paymentMethod)
  const [status, setStatusTransaction] = useState(statusTransaction)

  const { data: cashbackStatuses } = useSWR<CashbackStatuses[]>(
    'company/transaction-status'
  )

  const { data: paymentMethods } = useSWR<PaymentMethods[]>(
    'company/payment-methods'
  )

  function resetFilter() {
    reset()

    setStartDate(firstDate)
    setEndDate(secondDate)
    setOrderBy(orderBy)
    setOrder(order)
    setPaymentMethod(0)
    setStatusTransaction(0)
  }

  function handleSubmit() {
    if (!startDate || !endDate) return

    setForm({
      firstDate: startDate,
      secondDate: endDate,
      orderBy: localOrderBy,
      order: localOrder,
      paymentMethod: payment ? Number(payment) : undefined,
      statusTransaction: status ? Number(status) : undefined
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

              {!!cashbackStatuses && (
                <ChakraSelect
                  options={[
                    { id: 0, description: 'Todos' },
                    ...cashbackStatuses
                  ].map(status => ({
                    text: status.description,
                    value: status.id
                  }))}
                  label="Filtrar por Status"
                  name="orderBy"
                  value={status}
                  onChange={e => setStatusTransaction(Number(e.target.value))}
                />
              )}

              {!!paymentMethods && (
                <ChakraSelect
                  options={[
                    { id: 0, description: 'Todos' },
                    ...paymentMethods
                  ].map(method => ({
                    text: method.description,
                    value: method.id
                  }))}
                  label="Filtrar por Método de Pagamento"
                  name="orderBy"
                  value={payment}
                  onChange={e => setPaymentMethod(Number(e.target.value))}
                />
              )}

              <ChakraSelect
                options={[
                  { value: 'totalAmount', text: 'Total de compras' },
                  { value: 'cashbackAmount', text: 'Valor de Cashback' },
                  { value: 'takebackFeeAmount', text: 'Taxa de Takeback' }
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
    </>
  )
}
