import React, { useMemo, useState } from 'react'
import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  SimpleGrid,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure
} from '@chakra-ui/react'
import useSWR from 'swr'
import { Paginated } from '../../types'
import Loader from 'react-spinners/PulseLoader'
import { IoAttachOutline, IoFilterSharp } from 'react-icons/io5'
import { RiFileExcel2Line } from 'react-icons/ri'
import { useCashbackReport } from './components/cashback/state'
import { FilterDrawer } from './components/cashback/FilterDrawer'
import Layout from '../../components/ui/Layout'
import { API } from '../../services/API'
import { AppTable } from '../../components/tables'
import { Pagination } from '../../components/tables/Pagination'
import { currencyFormat } from '../../utils/currencytFormat'
import { TextBreak } from '../../components/tables/TextBreak'

export interface CashbackData {
  id: number
  totalAmount: number
  cashbackAmount: number
  takebackFeeAmount: number
  backAmount: number
  createdAt: string
  fullName: string
  status: string
  paymentMethod: string
  isTakebackMethod: boolean
  companyTotalPay: number
  companyName: string
  companyUserName: string
}

export interface TotalizerData {
  totalCashbackCount: number
  totalAmount: number
  totalTakebackFeeAmount: number
  totalBackAmount: number
  totalCashbackAmount: number
  totalToPay: number
}

export interface TaxTakeback {
  totalAmount: string
  takebackFeeAmount: string
  backAmount: string
  cashbackAmount: string
}

export function CashbackReport() {
  const [page, setPage] = useState(1)
  const {
    dateStart,
    dateEnd,
    cityId,
    order,
    orderBy,
    companyId,
    companyStatusId,
    companyUserId,
    stateId
  } = useCashbackReport()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const filter = {
    page,
    dateStart: new Date(dateStart).toISOString(),
    dateEnd: new Date(dateEnd).toISOString(),
    cityId,
    companyId,
    companyStatusId,
    companyUserId,
    stateId,
    order,
    orderByColumn: orderBy
  }

  const { data: cashbacks, isLoading } = useSWR<Paginated<CashbackData>>([
    'manager/report/cashbacks',
    filter
  ])

  const { data: totalizer } = useSWR<TotalizerData>([
    'manager/report/cashbacks/totalizer',
    filter
  ])

  if (!cashbacks || isLoading || !totalizer) {
    return (
      <Layout title="Cashbacks">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  async function exportExcel() {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório de Cashbacks.xlsx'
    const { data } = await API.get(`manager/report/cashbacks/excel`, {
      params: filter,

      responseType: 'blob'
    })

    link.href = URL.createObjectURL(new Blob([data], { type: 'text/xlsx' }))
    link.click()
  }

  async function exportPdf() {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório de Cashbacks.pdf'
    const { data } = await API.get(`manager/report/cashbacks/pdf`, {
      params: filter,
      responseType: 'blob'
    })

    link.href = URL.createObjectURL(
      new Blob([data], { type: 'application/pdf' })
    )
    link.click()
  }

  return (
    <Layout title="Cashbacks">
      <Box p={4} overflow="hidden">
        <Flex align="center" justify="space-between">
          <ButtonGroup>
            <Tooltip label="Filtrar">
              <IconButton
                mb={4}
                size="lg"
                aria-label="show"
                colorScheme="twitter"
                icon={<IoFilterSharp />}
                onClick={onOpen}
              />
            </Tooltip>
            <Tooltip label="Exportar PDF">
              <IconButton
                mb={4}
                size="lg"
                formTarget="_blank"
                aria-label="show"
                colorScheme="red"
                icon={<IoAttachOutline />}
                onClick={() => exportPdf()}
              />
            </Tooltip>
            <Tooltip label="Exportar XLSX">
              <IconButton
                mb={4}
                size="lg"
                formTarget="_blank"
                aria-label="show"
                colorScheme="green"
                icon={<RiFileExcel2Line />}
                onClick={() => exportExcel()}
              />
            </Tooltip>
          </ButtonGroup>
        </Flex>
        <AppTable
          dataLength={cashbacks.data.length}
          noDataMessage="Nenhum cashback"
          mt={4}
          overflowY="scroll"
          maxH="650px"
          pagination={
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={cashbacks.meta.lastPage}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>Ordem</Th>
              <Th>Nome</Th>
              <Th>Empresa</Th>
              <Th>Status</Th>
              <Th>F. de Pagamento</Th>
              <Th>Vendedor</Th>
              <Th>V. da Compra</Th>
              <Th>Tx. Takeback</Th>
              <Th>Cashback</Th>
              <Th>Troco</Th>
              <Th>V. a pagar</Th>
              <Th>Dt. de emissão</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cashbacks.data?.map(cashback => (
              <Tr color="gray.500" key={cashback.id}>
                <Td fontSize="xs">{cashback.id}</Td>
                <Td fontSize="xs">
                  <TextBreak>{cashback.fullName}</TextBreak>
                </Td>
                <Td fontSize="xs">
                  <TextBreak>{cashback.companyName}</TextBreak>
                </Td>
                <Td fontSize="xs">
                  <TextBreak>{cashback.status}</TextBreak>
                </Td>
                <Td fontSize="xs">{cashback.paymentMethod}</Td>
                <Td fontSize="xs">
                  <TextBreak>{cashback.companyUserName || '-'}</TextBreak>
                </Td>
                <Td fontSize="xs">{currencyFormat(cashback.totalAmount)}</Td>
                <Td fontSize="xs">
                  {currencyFormat(cashback.takebackFeeAmount)}
                </Td>
                <Td fontSize="xs">{currencyFormat(cashback.cashbackAmount)}</Td>
                <Td fontSize="xs">{currencyFormat(cashback.backAmount)}</Td>
                <Td fontSize="xs">
                  {currencyFormat(cashback.companyTotalPay)}
                </Td>
                <Td fontSize="xs">
                  {new Date(cashback.createdAt).toLocaleString()}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
        {cashbacks.data.length && !!totalizer ? (
          <SimpleGrid columns={[2, 2, 6]} spacing="4" mt="6">
            <Box>
              <Text fontWeight="bold">Qtd. de Cashbacks:</Text>
              <Text>{totalizer.totalCashbackCount}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">T. de Compras:</Text>
              <Text>{currencyFormat(totalizer.totalAmount)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Tx. Takeback:</Text>
              <Text>{currencyFormat(totalizer.totalTakebackFeeAmount)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">T. de Cashback:</Text>
              <Text>{currencyFormat(totalizer.totalCashbackAmount)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Troco:</Text>
              <Text>{currencyFormat(totalizer.totalBackAmount)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">V. pago:</Text>
              <Text>{currencyFormat(totalizer.totalToPay)}</Text>
            </Box>
          </SimpleGrid>
        ) : null}
      </Box>
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}
