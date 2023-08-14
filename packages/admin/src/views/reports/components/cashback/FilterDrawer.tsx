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
import { Order, useCashbackReport } from './state'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'
import { StateFilter } from '../../../../components/filters/StateFilter'
import { CityFilter } from '../../../../components/filters/CityFilter'
import { CompanyStatusFilter } from '../../../../components/filters/CompanyStatusFilter'
import { CompanyFilter } from '../../../../components/filters/CompanyFilter'
import { CompanyUserFilter } from '../../../../components/filters/CompanyUserFilter'
import { TransactionStatusFilter } from '../../../../components/filters/TransactionStatusFilter'
import { PaymentMethodFilter } from '../../../../components/filters/PaymentMethodFilter'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { setForm, dateStart, dateEnd, order, orderBy, reset } =
    useCashbackReport()

  const [localDateStart, setDateStart] = useState(dateStart)
  const [localDateEnd, setDateEnd] = useState(dateEnd)
  const [localOrderBy, setOrderBy] = useState(orderBy)
  const [localOrder, setOrder] = useState(order)
  const [localStateId, setStateId] = useState(0)
  const [localCityId, setCityId] = useState(0)
  const [localCompanyStatusId, setCompanyStatusId] = useState(0)
  const [localCompanyId, setCompanyId] = useState('')
  const [localCompanyUserId, setCompanyUserId] = useState('')
  const [localTransactionStatusId, setTransactionStatusId] = useState(0)
  const [localPaymentMethodId, setPaymentMethodId] = useState(0)

  function resetFilter() {
    reset()

    setDateStart(dateStart)
    setDateEnd(dateEnd)
    setOrderBy(orderBy)
    setOrder(order)
    setStateId(0)
    setCityId(0)
    setCompanyStatusId(0)
    setCompanyId('')
    setCompanyUserId('')
    setTransactionStatusId(0)
    setPaymentMethodId(0)
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
      companyStatusId: localCompanyStatusId || undefined,
      companyId: localCompanyId || undefined,
      companyUserId: localCompanyUserId || undefined,
      transactionStatusId: localTransactionStatusId || undefined,
      paymentMethodId: localPaymentMethodId || undefined
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
              <StateFilter value={localStateId} setValue={setStateId} />
              <CityFilter
                value={localCityId}
                setValue={setCityId}
                stateId={localStateId || undefined}
                isDisabled={!localStateId}
              />

              <CompanyStatusFilter
                name="status-empresa"
                label="Status da Empresa"
                value={localCompanyStatusId}
                setValue={setCompanyStatusId}
              />

              <CompanyFilter
                value={localCompanyId}
                setValue={setCompanyId}
                cityId={localCityId || undefined}
                statusId={localCompanyStatusId || undefined}
                stateId={localStateId || undefined}
              />

              <CompanyUserFilter
                companyId={localCompanyId || undefined}
                value={localCompanyUserId}
                setValue={setCompanyUserId}
                isDisabled={!localCompanyId}
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

              <PaymentMethodFilter
                value={localPaymentMethodId}
                setValue={setPaymentMethodId}
              />

              <ChakraSelect
                size="sm"
                options={[
                  { value: 'totalAmount', text: 'Valor da Compra' },
                  { value: 'cashbackAmount', text: 'Cashback' },
                  { value: 'takebackFeeAmount', text: 'Taxa' },
                  { value: 'createdAt', text: 'Data' }
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
