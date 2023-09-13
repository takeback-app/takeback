import React, { useMemo, useState } from 'react'
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Flex,
  Box,
  Checkbox,
  Tooltip,
  ButtonGroup,
  useDisclosure,
  Button
} from '@chakra-ui/react'
import { Layout } from '../../../components/ui/layout'
import { AppTable } from '../../../components/table'
import { IoFilterSharp } from 'react-icons/io5'
import useSWR, { mutate } from 'swr'
import Loader from 'react-spinners/PulseLoader'
import { FilterDrawer } from './components/filter/FilterDrawer'
import { useClientReport } from './components/filter/state'
import { currencyFormat } from '../../../utils/currencyFormat'
import { BlockModal } from '../../../components/modals/BlockModal'
import { API } from '../../../services/API'
import { toast } from '../../../components/ui/toast'
import { AxiosError } from 'axios'
import { ConfirmationModal } from './components/confirmationModal/ConfirmationModal'

export interface TransactionData {
  id: number
  transactionStatus: {
    description: string
  }
  consumer: {
    fullName: string
  }
  totalAmount: string
  cashbackAmount: string
  backAmount: string
  takebackFeeAmount: string
  createdAt: Date
}

export type ReturnApi = [boolean, { message: string }]

export function RecognizeSales() {
  const { firstDate, secondDate, order, orderBy } = useClientReport()
  const filterModal = useDisclosure()
  const confirmModal = useDisclosure()

  const filter = useMemo(
    () => ({
      dateStart: new Date(firstDate).toISOString(),
      dateEnd: new Date(secondDate).toISOString(),
      order,
      orderByColumn: orderBy
    }),
    [firstDate, secondDate, order, orderBy]
  )

  const {
    data: transactions,
    isLoading,
    error
  } = useSWR<TransactionData[]>(['company/recognize-sales/find', filter])

  const [checkedItems, setCheckedItems] = useState<number[]>([])

  const handleCheckboxChange = (value: number) => {
    if (checkedItems.includes(value)) {
      setCheckedItems(checkedItems.filter(item => item !== value))
      return
    }
    setCheckedItems([...checkedItems, value])
  }

  async function handleRecognizeSales() {
    confirmModal.onClose()

    try {
      const response = await API.put('/company/recognize-sales/recognize', {
        transactionIDs: checkedItems
      })
      toast({
        title: 'Cashback Reconhecido!',
        description: response.data,
        type: 'success'
      })
      mutate(['company/recognize-sales/find', filter])
      setCheckedItems([])
    } catch (err) {
      const error = err as AxiosError

      const message =
        error.response?.data.message || 'Erro interno. Contate um administrador'

      toast({
        title: 'Ops :(',
        description: message,
        type: 'error'
      })
    }
  }

  const isIndeterminate =
    checkedItems.length > 0 && checkedItems.length < (transactions?.length || 0)
  const isChecked = checkedItems.length === transactions?.length

  if (error) {
    return (
      <Layout title="Receber Cashback">
        <BlockModal
          isOpen={true}
          hasBlur
          title="Você não tem acesso a este página"
          subtitle="Entre em contato com o administrador da sua empresa para solicitar acesso a esse página."
        />
      </Layout>
    )
  }

  if (!transactions || isLoading) {
    return (
      <Layout title="Receber Cashback">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Receber Cashback">
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
                onClick={filterModal.onOpen}
              />
            </Tooltip>
          </ButtonGroup>
          <Button colorScheme="green" onClick={confirmModal.onOpen}>
            Receber Cashback
          </Button>
        </Flex>
        <AppTable
          dataLength={transactions?.length}
          noDataMessage="Nenhuma venda"
          mt={4}
          overflowY="scroll"
        >
          <Thead>
            <Tr>
              <Th>
                <Checkbox
                  isChecked={isChecked}
                  isIndeterminate={isIndeterminate}
                  onChange={() => {
                    if (isChecked) {
                      setCheckedItems([])
                    } else {
                      const transactionIds = transactions.map(transaction => {
                        return transaction.id
                      })
                      setCheckedItems(transactionIds)
                    }
                  }}
                ></Checkbox>
              </Th>
              <Th>Cliente</Th>
              <Th>Status</Th>
              <Th>Valor da Compra</Th>
              <Th>Cashback</Th>
              <Th>Tx. Takeback</Th>
              <Th>Troco</Th>
              <Th>Data de Emissão</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction: TransactionData) => (
              <Tr color="gray.500" key={transaction?.id}>
                <Td fontSize="xs">
                  <Checkbox
                    value="item1"
                    isChecked={checkedItems.includes(transaction?.id)}
                    onChange={() => handleCheckboxChange(transaction?.id)}
                  ></Checkbox>
                </Td>
                <Td fontSize="xs">{transaction?.consumer?.fullName}</Td>
                <Td fontSize="xs">
                  {transaction?.transactionStatus?.description}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(Number(transaction?.totalAmount))}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(Number(transaction?.cashbackAmount))}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(Number(transaction?.takebackFeeAmount))}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(Number(transaction?.backAmount))}
                </Td>
                <Td fontSize="xs">
                  {new Date(transaction?.createdAt).toLocaleString()}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
      </Box>
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.onClose}
        handleRecognizeSales={handleRecognizeSales}
      />
      <FilterDrawer isOpen={filterModal.isOpen} onClose={filterModal.onClose} />
    </Layout>
  )
}
