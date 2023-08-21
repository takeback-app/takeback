import React, { useState } from 'react'
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
import { FilterDrawer } from './components/financial/FilterDrawer'
import Layout from '../../components/ui/Layout'
import { API } from '../../services/API'
import { AppTable } from '../../components/tables'
import { Pagination } from '../../components/tables/Pagination'
import { currencyFormat } from '../../utils/currencytFormat'
import { TextBreak } from '../../components/tables/TextBreak'
import { useFinancialReport } from './components/financial/state'

export interface FinancialData {
  id: string
  city: string
  takebackFeeAmount: number
  monthlyPayment: number
  storeSellValue: number
  newUserBonus: number
  sellBonus: number
  consultantBonus: number
  referralBonus: number
  storeBuyValue: number
}

export interface TotalizerData {
  totalTakebackFeeAmount: number
  sellBonusAmount: number
  newUserBonusAmount: number
  companyMonthlyPaymentsAmount: number
  balanceAmount: number
  totalStoreBuyValue: number
  totalStoreSellValue: number
  consultantBonusAmount: number
  referralBonusAmount: number
}

export function FinancialReport() {
  const [page, setPage] = useState(1)
  const {
    dateStart,
    dateEnd,
    order,
    orderBy,
    transactionStatusId,
    monthlyPayment
  } = useFinancialReport()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const filter = {
    page,
    dateStart: new Date(dateStart).toISOString(),
    dateEnd: new Date(dateEnd).toISOString(),
    transactionStatusId,
    monthlyPayment,
    order,
    orderByColumn: orderBy
  }

  const { data: financials, isLoading } = useSWR<Paginated<FinancialData>>([
    'manager/report/financial',
    filter
  ])

  const { data: totalizer } = useSWR<TotalizerData>([
    'manager/report/financial/totalizer',
    filter
  ])

  async function exportExcel() {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório Financeiro.xlsx'
    const { data } = await API.get(`manager/report/financial/excel`, {
      params: filter,

      responseType: 'blob'
    })

    link.href = URL.createObjectURL(new Blob([data], { type: 'text/xlsx' }))
    link.click()
  }

  async function exportPdf() {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório Financeiro.pdf'
    const { data } = await API.get(`manager/report/financial/pdf`, {
      params: filter,
      responseType: 'blob'
    })

    link.href = URL.createObjectURL(
      new Blob([data], { type: 'application/pdf' })
    )
    link.click()
  }

  return (
    <Layout title="Financials">
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
          dataLength={financials?.data.length}
          noDataMessage="Nenhum cashback"
          mt={4}
          overflowY="scroll"
          maxH="650px"
          pagination={
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={financials?.meta.lastPage || 0}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>Cidade</Th>
              <Th>Taxas</Th>
              <Th>Mensalidades</Th>
              <Th>Ofertas</Th>
              <Th>Grati. compra</Th>
              <Th>Grati. novo usuário</Th>
              <Th>Grati. repre.</Th>
              <Th>Grati. indicação</Th>
              <Th>Custo ofertas</Th>
              <Th>Saldo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {financials?.data.map(financial => (
              <Tr color="gray.500" key={financial.id}>
                <Td fontSize="xs">
                  <TextBreak>{financial?.city}</TextBreak>
                </Td>
                <Td fontSize="xs">
                  <TextBreak>
                    {currencyFormat(financial?.takebackFeeAmount)}
                  </TextBreak>
                </Td>
                <Td fontSize="xs">
                  <TextBreak>
                    {currencyFormat(financial?.monthlyPayment)}
                  </TextBreak>
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(financial?.storeSellValue)}
                </Td>
                <Td fontSize="xs">{currencyFormat(financial?.sellBonus)}</Td>
                <Td fontSize="xs">
                  <TextBreak>
                    {currencyFormat(financial?.newUserBonus)}
                  </TextBreak>
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(financial?.consultantBonus)}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(financial?.referralBonus)}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(financial?.storeBuyValue)}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(
                    financial?.takebackFeeAmount +
                      financial?.monthlyPayment +
                      financial?.storeSellValue -
                      financial?.newUserBonus -
                      financial?.sellBonus -
                      financial?.consultantBonus -
                      financial?.referralBonus -
                      financial?.storeBuyValue
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
        {financials?.data.length && !!totalizer ? (
          <SimpleGrid columns={[4, 6, 5]} spacing="4" mt="6">
            <Box>
              <Text fontWeight="bold">Total Fatu. Taxas:</Text>
              <Text>{currencyFormat(totalizer.totalTakebackFeeAmount)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">T. Mensalidade:</Text>
              <Text>
                {currencyFormat(totalizer.companyMonthlyPaymentsAmount)}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">T. Ofertas:</Text>
              <Text>{currencyFormat(totalizer.totalStoreSellValue)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">T. Grati. por compra:</Text>
              <Text>{currencyFormat(totalizer.sellBonusAmount)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">T. Grati. novo usuário:</Text>
              <Text>{currencyFormat(totalizer.newUserBonusAmount)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">T. Grati. repre:</Text>
              <Text>{currencyFormat(totalizer.consultantBonusAmount)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">T. Grati. indicação:</Text>
              <Text>{currencyFormat(totalizer.referralBonusAmount)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">T. Custo ofertas:</Text>
              <Text>{currencyFormat(totalizer.totalStoreBuyValue)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Saldo Total:</Text>
              <Text>{currencyFormat(totalizer.balanceAmount)}</Text>
            </Box>
          </SimpleGrid>
        ) : null}
      </Box>
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}
