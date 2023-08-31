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
import { Order, TransactionStatusTypes, useCompanyReport } from './state'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'
import { CityFilter } from '../../../../components/filters/CityFilter'
import { StateFilter } from '../../../../components/filters/StateFilter'
import { TransactionStatusFilter } from '../../../../components/filters/TransactionStatusFilter'
import { CompanyStatusFilter } from '../../../../components/filters/CompanyStatusFilter'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { setForm, dateStart, dateEnd, order, orderBy, reset } =
    useCompanyReport()

  const [localDateStart, setDateStart] = useState(dateStart)
  const [localDateEnd, setDateEnd] = useState(dateEnd)
  const [localOrderBy, setOrderBy] = useState(orderBy)
  const [localOrder, setOrder] = useState(order)
  const [localStateId, setStateId] = useState(0)
  const [localCityId, setCityId] = useState(0)
  const [localCompanyStatusId, setCompanyStatusId] = useState(0)
  const [localTransactionStatusId, setTransactionStatusId] = useState(
    TransactionStatusTypes.APPROVED
  )

  function resetFilter() {
    reset()

    setDateStart(dateStart)
    setDateEnd(dateEnd)
    setOrderBy(orderBy)
    setOrder(order)
    setStateId(0)
    setCityId(0)
    setTransactionStatusId(TransactionStatusTypes.APPROVED)
    setCompanyStatusId(0)
  }

  function handleSubmit() {
    if (!localDateStart || !localDateEnd) return

    setForm({
      dateStart: localDateStart,
      dateEnd: localDateEnd,
      orderBy: localOrderBy,
      order: localOrder,
      cityId: localCityId || undefined,
      stateId: localStateId || undefined,
      transactionStatusId: localTransactionStatusId || undefined,
      companyStatusId: localCompanyStatusId || undefined
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
            <StateFilter
              value={localStateId}
              setValue={setStateId}
              filterType="companyStates"
            />
            <CityFilter
              value={localCityId}
              setValue={setCityId}
              stateId={localStateId || undefined}
              isDisabled={!localStateId}
              filterType="companyCities"
            />
            <CompanyStatusFilter
              name="status-empresa"
              label="Status da Empresa"
              value={localCompanyStatusId}
              setValue={setCompanyStatusId}
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
            <TransactionStatusFilter
              value={localTransactionStatusId}
              setValue={setTransactionStatusId}
            />
            <ChakraSelect
              size="sm"
              options={[
                { value: 'totalAmount', text: 'Total de faturamento' },
                { value: 'fantasyName', text: 'Nome da empresa' },
                { value: 'takebackFeeAmount', text: 'Taxa' },
                { value: 'cashbackAmount', text: 'Total de cashback' },
                { value: 'positiveBalance', text: 'Total de saldo' }
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
  )
}
