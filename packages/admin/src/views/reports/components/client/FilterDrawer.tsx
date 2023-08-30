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
import { Order, HaveTransactions, useClientReport } from './state'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'
import { CityFilter } from '../../../../components/filters/CityFilter'
import { StateFilter } from '../../../../components/filters/StateFilter'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const {
    setForm,
    dateStart,
    dateEnd,
    order,
    haveTransactions,
    orderBy,
    reset
  } = useClientReport()

  const [localDateStart, setDateStart] = useState(dateStart)
  const [localDateEnd, setDateEnd] = useState(dateEnd)
  const [localOrderBy, setOrderBy] = useState(orderBy)
  const [localOrder, setOrder] = useState(order)
  const [localHaveTransactions, setHaveTransactions] =
    useState(haveTransactions)
  const [localIsPlaceholder, setIsPlaceholder] = useState('')
  const [localStateId, setStateId] = useState(0)
  const [localCityId, setCityId] = useState(0)

  function resetFilter() {
    reset()

    setDateStart(dateStart)
    setDateEnd(dateEnd)
    setOrderBy(orderBy)
    setOrder(order)
    setStateId(0)
    setCityId(0)
    setIsPlaceholder('')
    setHaveTransactions(haveTransactions)
  }

  function handleSubmit() {
    if (!localDateStart || !localDateEnd) return

    setForm({
      dateStart: localDateStart,
      dateEnd: localDateEnd,
      orderBy: localOrderBy,
      order: localOrder,
      haveTransactions: localHaveTransactions,
      isPlaceholder: localIsPlaceholder || undefined,
      cityId: localCityId || undefined,
      stateId: localStateId || undefined
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
            <ChakraSelect
              size="sm"
              options={[
                { value: '', text: 'Todos' },
                { value: 'false', text: 'Usuários Cadastrados' },
                { value: 'true', text: 'Usuários Não Cadastrados' }
              ]}
              label="Tipo de Usuário"
              name="isPlaceholder"
              value={localIsPlaceholder}
              onChange={e => setIsPlaceholder(e.target.value as string)}
            />
            <ChakraSelect
              size="sm"
              options={[
                { value: 'true', text: 'Com Movimentações' },
                { value: 'false', text: 'Sem Movimentações' }
              ]}
              label="Movimentações"
              name="transactions"
              value={localHaveTransactions}
              onChange={e =>
                setHaveTransactions(e.target.value as HaveTransactions)
              }
            />
            <StateFilter
              value={localStateId}
              setValue={setStateId}
              haveTransactions={localHaveTransactions}
              isDisabled={!localHaveTransactions}
              filterType="consumerStates"
            />
            <CityFilter
              value={localCityId}
              setValue={setCityId}
              stateId={localStateId || undefined}
              isDisabled={!localStateId}
              filterType="consumerCities"
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
                { value: 'totalAmount', text: 'Total de compras' },
                { value: 'consumers.fullName', text: 'Nome do cliente' },
                { value: 'balance', text: 'Saldo atual' },
                { value: 'blockedBalance', text: 'Saldo pendente' },
                { value: 'cashbackApproved', text: 'Cashbacks Aprovados' }
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
