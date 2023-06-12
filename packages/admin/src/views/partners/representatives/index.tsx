import React, { useState } from 'react'

import {
  Button,
  Flex,
  IconButton,
  Stack,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr
} from '@chakra-ui/react'

import PageLoader from '../../../components/loaders/primaryLoader'

import { IoEye } from 'react-icons/io5'

import useSWR from 'swr'

import { useNavigate } from 'react-router'
import Layout from '../../../components/ui/Layout'
import { Pagination } from '../../../components/tables/Pagination'
import { Paginated } from '../../../types'
import { AppTable } from '../../../components/tables'
import { percentFormat } from '../../../utils/percentFormat'
import { maskCNPJ } from '../../../utils/masks'

interface Representative {
  id: string
  fantasyName: string
  cnpj: string
  phone: string
  email: string
  isActive: boolean
  balance: string
  commissionPercentage: string
  consultantBonusPercentage: string
  createdAt: string
  updatedAt: string
}

export function Representatives() {
  const navigateTo = useNavigate()

  const [page, setPage] = useState(1)

  const { data } = useSWR<Paginated<Representative>>(
    `manager/representatives?page=${page}`
  )

  if (!data) {
    return (
      <Layout title="Saque">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PageLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Representantes" p={4}>
      <Stack>
        <Flex align="center" justify="flex-end">
          <Button
            colorScheme="blue"
            onClick={() => navigateTo('/parceiros/representantes/criar')}
          >
            Criar
          </Button>
        </Flex>
        <AppTable
          dataLength={data.data.length}
          noDataMessage="Nenhum representante"
          pagination={
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={data.meta.lastPage}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>CNPJ</Th>
              <Th>Status</Th>
              <Th>Comissão (%)</Th>
              <Th>Bónus do Consultor (%)</Th>
              <Th isNumeric>Data de criação</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.data.map(representative => (
              <Tr color="gray.500" key={representative.id}>
                <Td>{representative.fantasyName}</Td>
                <Td fontSize="xs">
                  <Text maxW="md" isTruncated noOfLines={1}>
                    {maskCNPJ(representative.cnpj)}
                  </Text>
                </Td>
                <Td fontSize="xs">
                  <Tag colorScheme={representative.isActive ? 'green' : 'red'}>
                    {representative.isActive ? 'Ativo' : 'Inativo'}
                  </Tag>
                </Td>
                <Td fontSize="xs">
                  {percentFormat(Number(representative.commissionPercentage))}
                </Td>
                <Td fontSize="xs">
                  {percentFormat(
                    Number(representative.consultantBonusPercentage)
                  )}
                </Td>
                <Td fontSize="xs" isNumeric>
                  {new Date(representative.createdAt).toLocaleDateString()}
                </Td>
                <Td isNumeric>
                  <Tooltip label="Detalhes">
                    <IconButton
                      size="sm"
                      aria-label="cancel"
                      icon={<IoEye />}
                      onClick={() =>
                        navigateTo(
                          `/parceiros/representantes/${representative.id}`
                        )
                      }
                    />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
      </Stack>
    </Layout>
  )
}
