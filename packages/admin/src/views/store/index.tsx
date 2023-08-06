import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Stack,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast
} from '@chakra-ui/react'
import useSWR from 'swr'

import PageLoader from '../../components/loaders/primaryLoader'

import { Paginated } from '../../types'
import Layout from '../../components/ui/Layout'
import { AppTable } from '../../components/tables'
import { Pagination } from '../../components/tables/Pagination'
import { DeleteButton } from '../../components/DeleteButton'
import { chakraToastConfig } from '../../styles/chakraToastConfig'
import { deleteProduct } from './services/api'
import { IoEye } from 'react-icons/io5'

interface Product {
  id: string
  name: string
  imageUrl: string
  companyId: string
  buyPrice: string
  sellPrice: string
  stock: number
  maxBuyPerConsumer: number
  dateLimit: string
  dateLimitWithdrawal: string
  createdAt: string
  company: {
    fantasyName: string
  }
}

export function StoreProductsList() {
  const toast = useToast(chakraToastConfig)

  const navigateTo = useNavigate()

  const [page, setPage] = useState(1)

  const { data, mutate } = useSWR<Paginated<Product>>(
    `manager/store/products?page=${page}`
  )

  async function handleDelete(id: string) {
    const [isOk, data] = await deleteProduct(id)

    if (!isOk) {
      return toast({
        title: 'Ops :(',
        description: data.message,
        status: 'error'
      })
    }

    await mutate()

    toast({
      title: 'Sucesso',
      description: data.message,
      status: 'success'
    })
  }

  if (!data) {
    return (
      <Layout title="Ofertas">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PageLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Ofertas" p={4}>
      <Stack>
        <Flex align="center" justify="flex-end">
          <Button
            colorScheme="blue"
            onClick={() => navigateTo('/ofertas/criar')}
          >
            Criar
          </Button>
        </Flex>
        <AppTable
          dataLength={data.data.length}
          noDataMessage="Nenhuma oferta"
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
              <Th>Empresa</Th>
              <Th>Estoque atual</Th>
              <Th>Data Limite</Th>
              <Th>Data Limite para retirada</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.data.map(product => (
              <Tr color="gray.500" key={product.id}>
                <Td>{product.name}</Td>
                <Td>{product.company.fantasyName}</Td>
                <Td>{product.stock}</Td>
                <Td>{new Date(product.dateLimit).toLocaleDateString()}</Td>
                <Td>
                  {new Date(product.dateLimitWithdrawal).toLocaleDateString()}
                </Td>
                <Td isNumeric>
                  <ButtonGroup>
                    <Tooltip label="Detalhes">
                      <IconButton
                        size="sm"
                        aria-label="cancel"
                        icon={<IoEye />}
                        onClick={() => navigateTo(`/ofertas/${product.id}`)}
                      />
                    </Tooltip>
                    <Tooltip label="Deletar">
                      <DeleteButton
                        aria-label="delete"
                        handleDelete={() => handleDelete(product.id)}
                        title="Apagar oferta"
                        body="Tem certeza que deseja apagar essa oferta? Essa ação não pode ser desfeita."
                      />
                    </Tooltip>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
      </Stack>
    </Layout>
  )
}
