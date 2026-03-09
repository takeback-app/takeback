import React, { useContext, useEffect, useState } from 'react'

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
import moment from 'moment'
import { ChakraInput } from '../../../../../../components/chakra/ChakraInput'
import { ChakraSelect } from '../../../../../../components/chakra/ChakraSelect'
import { CompanyFilter } from '../../../../../../components/filters/CompanyFilter'
import { PaymentMethodFilter } from '../../../../../../components/filters/PaymentMethodFilter'
import { usePaymentOrders } from './state'
import { API } from '../../../../../../services/API'
import { CAppData } from '../../../../../../contexts/CAppData'
import { notifyError } from '../../../../../../components/ui/Toastify'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { setPaymentOrderMethods, paymentOrderStatus, setPaymentOrderStatus } =
    useContext(CAppData)
  const {
    setForm,
    startDate,
    endDate,
    companyId,
    paymentMethodId,
    statusId,
    reset
  } = usePaymentOrders()

  const [localStatusId, setStatusId] = useState(statusId || 0)
  const [localPaymentMethodId, setPaymentMethodId] = useState(
    paymentMethodId || 0
  )
  const [localCompanyId, setCompanyId] = useState(companyId || '')
  const [localStartDate, setStartDate] = useState(startDate)
  const [localEndDate, setEndDate] = useState(endDate)

  function resetFilter() {
    const resetStartDate = moment().subtract(1, 'month').format('YYYY-MM-DD')
    const resetEndDate = moment().format('YYYY-MM-DD')
    reset()

    setStartDate(resetStartDate)
    setEndDate(resetEndDate)
    setStatusId(0)
    setPaymentMethodId(0)
    setCompanyId('')
  }

  function handleSubmit() {
    if (!localStartDate || !localEndDate) return
    setForm({
      startDate: localStartDate,
      endDate: localEndDate,
      companyId: localCompanyId || undefined,
      statusId: localStatusId || undefined,
      paymentMethodId: localPaymentMethodId || undefined
    })

    onClose()
  }

  useEffect(() => {
    function findFilters() {
      API.get('/manager/order/find/filters')
        .then(response => {
          setPaymentOrderMethods(response.data.methods)
          setPaymentOrderStatus(response.data.status)
        })
        .catch(error => {
          if (error.isAxiosError) {
            notifyError(error.response.data.message)
          }
        })
    }

    findFilters()
  }, [])

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filtros</DrawerHeader>

          <DrawerBody>
            <Stack spacing={6}>
              <CompanyFilter value={localCompanyId} setValue={setCompanyId} />
              <ChakraSelect
                size="sm"
                options={[
                  { id: 0, description: 'Todos' },
                  ...paymentOrderStatus
                ].map(status => ({
                  text: status.description,
                  value: status.id
                }))}
                label="Ordem"
                name="status"
                value={localStatusId}
                onChange={e => setStatusId(e.target.value as unknown as number)}
              />
              <PaymentMethodFilter
                value={localPaymentMethodId}
                setValue={setPaymentMethodId}
              />
              <ChakraInput
                size="sm"
                type="date"
                label="Período inicial"
                value={localStartDate}
                onChange={e => setStartDate(e.target.value)}
                isRequired
              />
              <ChakraInput
                size="sm"
                type="date"
                label="Período final"
                value={localEndDate}
                onChange={e => setEndDate(e.target.value)}
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
