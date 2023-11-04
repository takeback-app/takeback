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
import Layout from '../../../components/ui/Layout'
import { AppTable } from '../../../components/tables'
import { Pagination } from '../../../components/tables/Pagination'
import { currencyFormat } from '../../../utils/currencytFormat'
import { useNavigate } from 'react-router'

export interface TransfersData {
  id: number
  value: string
  createdAt: string
  receiverCompany: {
    fantasyName: string
  }
  senderCompany: {
    fantasyName: string
  }
}

export function CompanyTransfers() {
  const navigateTo = useNavigate()
  const [page, setPage] = useState(1)
  const filter = {
    page
  }

  const { data: transfers, isLoading } = useSWR<Paginated<TransfersData>>([
    'manager/company/transfer/list',
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
              onClick={() => navigateTo('/parceiros/transferencias/criar')}
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
              <Th>Número</Th>
              <Th>Empresa que enviou</Th>
              <Th>Empresa que recebeu</Th>
              <Th>Valor</Th>
              <Th>Dt. de emissão</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transfers?.data.map(transfer => (
              <Tr color="gray.500" key={transfer.id}>
                <Td fontSize="xs">{transfer.id}</Td>
                <Td fontSize="xs">{transfer.senderCompany.fantasyName}</Td>
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
