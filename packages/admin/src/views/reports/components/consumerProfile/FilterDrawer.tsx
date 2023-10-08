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
import { StateFilter } from '../../../../components/filters/StateFilter'
import { CityFilter } from '../../../../components/filters/CityFilter'
import { CompanyFilter } from '../../../../components/filters/CompanyFilter'
import { useConsumerProfileReport } from './state'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { setForm, reset } = useConsumerProfileReport()

  const [localStateId, setStateId] = useState(0)
  const [localCityId, setCityId] = useState(0)
  const [localCompanyId, setCompanyId] = useState('')

  function resetFilter() {
    reset()

    setStateId(0)
    setCityId(0)
    setCompanyId('')
  }

  function handleSubmit() {
    setForm({
      cityId: localCityId || undefined,
      stateId: localStateId || undefined,
      companyId: localCompanyId || undefined
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

              <CompanyFilter
                value={localCompanyId}
                setValue={setCompanyId}
                cityId={localCityId || undefined}
                stateId={localStateId || undefined}
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
