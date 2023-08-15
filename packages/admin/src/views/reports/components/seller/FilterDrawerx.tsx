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
import { Order, useSellerReport } from './state'
import useSWR from 'swr'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'
import { StateFilter } from '../../../../components/filters/StateFilter'
import { CityFilter } from '../../../../components/filters/CityFilter'
import { CompanyFilter } from '../../../../components/filters/CompanyFilter'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

interface CashbackStatuses {
  id: number
  description: string
}

export interface CompanyUser {
  id: number
  description: string
  isManager: boolean
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const {
    setForm,
    dateStart,
    dateEnd,
    order,
    orderBy,
    officeJob,
    statusTransaction,
    reset
  } = useSellerReport()

  const [localDateStart, setStartDate] = useState(dateStart)
  const [localDateEnd, setEndDate] = useState(dateEnd)
  const [localOrderBy, setOrderBy] = useState(orderBy)
  const [localOrder, setOrder] = useState(order)
  const [localOffice, setOffice] = useState(officeJob)
  const [localStatus, setStatusTransaction] = useState(statusTransaction)
  const [localStateId, setStateId] = useState(0)
  const [localCityId, setCityId] = useState(0)
  const [localCompanyId, setCompanyId] = useState('')

  const { data: cashbackStatuses } = useSWR<CashbackStatuses[]>(
    'manager/transaction-status'
  )

  const { data: companyUser } = useSWR<CompanyUser[]>(
    'manager/company-user-types'
  )

  function resetFilter() {
    reset()

    setStartDate(dateStart)
    setEndDate(dateEnd)
    setOrderBy(orderBy)
    setOrder(order)
    setOffice(0)
    setStatusTransaction(0)
    setCompanyId('')
    setStateId(0)
    setCityId(0)
  }

  function handleSubmit() {
    if (!localDateStart || !localDateEnd) return

    setForm({
      dateStart: localDateStart,
      dateEnd: localDateEnd,
      orderBy: localOrderBy,
      order: localOrder,
      officeJob: localOffice ? Number(localOffice) : undefined,
      statusTransaction: localStatus ? Number(localStatus) : undefined,
      cityId: localCityId || undefined,
      stateId: localStateId || undefined,
      companyId: localCompanyId || undefined
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
            <StateFilter size="sm" value={localStateId} setValue={setStateId} />
            <CityFilter
              size="sm"
              value={localCityId}
              setValue={setCityId}
              stateId={localStateId || undefined}
              isDisabled={!localStateId}
            />
            <CompanyFilter
              size="sm"
              isDisabled={!localCityId}
              value={localCompanyId}
              setValue={setCompanyId}
              cityId={localCityId || undefined}
              stateId={localStateId || undefined}
            />
            <ChakraInput
              size="sm"
              type="date"
              label="Período inicial"
              value={localDateStart}
              onChange={e => setStartDate(e.target.value)}
              isRequired
            />

            <ChakraInput
              size="sm"
              type="date"
              label="Período final"
              value={localDateEnd}
              onChange={e => setEndDate(e.target.value)}
              isRequired
            />

            {!!cashbackStatuses && (
              <ChakraSelect
                size="sm"
                options={[
                  { id: 0, description: 'Todos' },
                  ...cashbackStatuses
                ].map(status => ({
                  text: status.description,
                  value: status.id
                }))}
                label="Filtrar por Status"
                name="orderBy"
                value={localStatus}
                onChange={e => setStatusTransaction(Number(e.target.value))}
              />
            )}

            {!!companyUser && (
              <ChakraSelect
                size="sm"
                options={[{ id: 0, description: 'Todos' }, ...companyUser].map(
                  user => ({
                    text: user.description,
                    value: user.id
                  })
                )}
                label="Filtrar por Cargo"
                name="orderBy"
                value={localOffice}
                onChange={e => setOffice(Number(e.target.value))}
              />
            )}

            <ChakraSelect
              size="sm"
              options={[
                { value: 'sellerName', text: 'Nome do vendedor' },
                { value: 'totalAmount', text: 'Total de vendas' },
                { value: 'newClients', text: 'Quantidade de Clientes Trazidos' }
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
