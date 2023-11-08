import React, { useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import useSWR from 'swr'
import Loader from 'react-spinners/PulseLoader'
import { Paginated } from '../../../types'
import { useNavigate } from 'react-router'
import { Layout } from '../../../components/ui/layout'
import { AppTable } from '../../../components/table'
import { Pagination } from '../../../components/table/Pagination'
import { currencyFormat } from '../../../utils/currencyFormat'

export interface TransfersData {
  id: number
  value: string
  createdAt: string
  receiverCompany: {
    fantasyName: string
  }
}

export function Transfers() {
  const navigateTo = useNavigate()
  const [page, setPage] = useState(1)
  const filter = {
    page
  }

  const { data: transfers, isLoading } = useSWR<Paginated<TransfersData>>([
    'company/transfer/list',
    filter
  ])

  return (
    <Layout title="Transferências">
      <Flex
        w="full"
        h="70vh"
        align="center"
        justify="center"
        display={isLoading ? 'flex' : 'none'}
      >
        <Loader color="rgba(54, 162, 235, 1)" />
      </Flex>
      <Box p={4} overflow="hidden" display={isLoading ? 'none' : 'block'}>
        <Flex align="center" justify="space-between">
          <ButtonGroup>
            <Button
              colorScheme="blue"
              onClick={() => navigateTo('/transferencias/criar')}
            >
              Criar
            </Button>
          </ButtonGroup>
        </Flex>
        <AppTable
          dataLength={transfers?.data.length}
          noDataMessage="Nenhuma transferência"
          mt={4}
          overflowY="scroll"
          maxH="650px"
          pagination={
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={transfers?.meta.lastPage || 0}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Empresa que recebeu</Th>
              <Th>Valor</Th>
              <Th>Dt. de emissão</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transfers?.data.map(transfer => (
              <Tr color="gray.500" key={transfer.id}>
                <Td fontSize="xs">{transfer.id}</Td>
                <Td fontSize="xs">{transfer.receiverCompany.fantasyName}</Td>
                <Td fontSize="xs">{currencyFormat(Number(transfer.value))}</Td>
                <Td fontSize="xs">
                  {new Date(transfer.createdAt).toLocaleString()}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
      </Box>
    </Layout>
  )
}
