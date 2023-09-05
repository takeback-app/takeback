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
import { ChakraSelect } from '../../../cashRegister/components/ChakraSelect'
import useSWR from 'swr'
import { useExtractReport } from '../../../extract/components/filter/state'

interface FilterPeriod {
  value: string
  text: string
}

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { setForm, reset, month, year } = useExtractReport()

  const [localMonth, setMonth] = useState(month)
  const [localYear, setYear] = useState(year)

  const { data: yearOptions } = useSWR<FilterPeriod[]>(
    'company/extract/filter-period'
  )

  function resetFilter() {
    reset()

    setMonth(month)
    setYear(year)
  }

  function handleSubmit() {
    setForm({
      month: localMonth,
      year: localYear
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
                options={[
                  { value: '0', text: 'Janeiro' },
                  { value: '1', text: 'Fevereiro' },
                  { value: '2', text: 'Março' },
                  { value: '3', text: 'Abril' },
                  { value: '4', text: 'Maio' },
                  { value: '5', text: 'Junho' },
                  { value: '6', text: 'Julho' },
                  { value: '7', text: 'Agosto' },
                  { value: '8', text: 'Setembro' },
                  { value: '9', text: 'Outubro' },
                  { value: '10', text: 'Novembro' },
                  { value: '11', text: 'Dezembro' }
                ]}
                label="Escolha o mês"
                name="month"
                value={localMonth}
                onChange={e => setMonth(e.target.value)}
              />
              {!!yearOptions && (
                <ChakraSelect
                  options={yearOptions || []}
                  label="Escolha o ano"
                  name="year"
                  value={localYear}
                  onChange={e => setYear(e.target.value)}
                />
              )}
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
