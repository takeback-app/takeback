import React from 'react'

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
import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'

import useSWR from 'swr'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterProps
  setFilters: React.Dispatch<React.SetStateAction<FilterProps>>
}

export interface FilterProps {
  status?: string
  startDate?: string
  endDate?: string
}

interface TransactionStatus {
  description: string
  id: number
}

export const formInitialData = {
  status: '0',
  startDate: undefined,
  endDate: undefined
}

const schema = z.object({
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})

type FilterData = z.infer<typeof schema>

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  setFilters
}: FilterDrawerProps) {
  const { data: status } = useSWR<TransactionStatus[]>(
    'company/cashbacks/status'
  )

  const { register, handleSubmit, setValue } = useForm<FilterData>({
    resolver: zodResolver(schema),
    defaultValues: filters
  })

  function onSubmit(data: FilterData) {
    setFilters({
      status: data?.status === '0' ? undefined : data?.status,
      startDate: data?.startDate ? data.startDate : undefined,
      endDate: data?.endDate ? data.endDate : undefined
    })
  }

  function resetFilters() {
    setValue('status', '0')
    setValue('startDate', '')
    setValue('endDate', '')

    setFilters(formInitialData)
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
              label="Status"
              size="sm"
              isRequired
              options={[
                { text: 'Todos', value: '' },
                ...(status?.map(s => ({ text: s.description, value: s.id })) ||
                  [])
              ]}
              {...register('status')}
            />
            <ChakraInput
              label="Período inicio"
              size="sm"
              type="date"
              {...register('startDate')}
            />

            <ChakraInput
              label="Período fim"
              size="sm"
              type="date"
              {...register('endDate')}
            />
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <ButtonGroup>
            <Button onClick={resetFilters}>Limpar Filtros</Button>
            <Button colorScheme="twitter" onClick={handleSubmit(onSubmit)}>
              Buscar
            </Button>
          </ButtonGroup>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
