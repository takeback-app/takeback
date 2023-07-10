import React from 'react'

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Stack
} from '@chakra-ui/react'
import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'

import useSWR from 'swr'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  statusId: string
  setStatusId: React.Dispatch<React.SetStateAction<string>>
}

interface TransactionStatus {
  description: string
  id: number
}

export function FilterDrawer({
  isOpen,
  onClose,
  statusId,
  setStatusId
}: FilterDrawerProps) {
  const { data: status } = useSWR<TransactionStatus[]>(
    'company/cashbacks/status'
  )

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Filtros</DrawerHeader>

        <DrawerBody>
          <Stack spacing={6}>
            <ChakraSelect
              label="Status"
              size="sm"
              value={statusId}
              onChange={e => setStatusId(e.target.value)}
              isRequired
              options={[
                { text: 'Todos', value: '' },
                ...(status?.map(s => ({ text: s.description, value: s.id })) ||
                  [])
              ]}
            />
          </Stack>
        </DrawerBody>

        {/* <DrawerFooter borderTopWidth="1px">
          <Button colorScheme="teal" onClick={handleSubmit}>
            Buscar
          </Button>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  )
}
