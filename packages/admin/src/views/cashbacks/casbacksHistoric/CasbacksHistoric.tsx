import React, { useState } from 'react'
import { IoFilter } from 'react-icons/io5'

import { currencyFormat } from '../../../utils/currencytFormat'

import Layout from '../../../components/ui/Layout'

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
  Flex,
  IconButton,
  Spinner,
  Stack,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { AppTable } from '../../../components/tables'
import { Pagination } from '../../../components/tables/Pagination'

import useSWR, { mutate } from 'swr'
import { Paginated } from '../../../types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { ChakraSelect } from '../../../components/chakra/ChakraSelect'
import { MdOutlineCancel } from 'react-icons/md'
import { DefaultModalChakra } from '../../../components/modals/DefaultModal/DefaultModalChakra'

import * as S from './styles'
import QuartenaryButton from '../../../components/buttons/QuartenaryButton'
import PALLET from '../../../styles/ColorPallet'
import { notifyError } from '../../../components/ui/Toastify'
import { API } from '../../../services/API'
import { chakraToastConfig } from '../../../styles/chakraToastConfig'

enum TransactionStatusEnum {
  PENDING = 'Pendente',
  APPROVED = 'Aprovada',
  PAID_WITH_TAKEBACK = 'Pago com takeback',
  WAITING = 'Aguardando',
  CANCELED_BY_PARTNER = 'Cancelada pelo parceiro',
  CANCELED_BY_CLIENT = 'Cancelada pelo cliente',
  PROCESSING = 'Em processamento',
  ON_DELAY = 'Em atraso',
  NOT_PAID = 'Não paga pelo parceiro'
}

interface Transaction {
  id: number
  totalAmount: string
  takebackFeeAmount: string
  cashbackAmount: string
  backAmount: string
  createdAt: Date
  transactionPaymentMethods: TransactionPaymentMethod[]
  consumer: {
    fullName: string
  }
  company: { fantasyName: string }
  companyUser?: {
    name: string
  }
  transactionStatus: {
    description: string
  }
}

interface TransactionPaymentMethod {
  companyPaymentMethod: {
    paymentMethod: {
      description: string
    }
  }
}

interface FilterProps {
  company?: string
  consumer?: string
  status?: string
  startDate?: string
  endDate?: string
}

const defaultSelect = [{ id: '0', description: 'Todos' }]

const formInitialData = {
  company: undefined,
  consumer: undefined,
  status: '0',
  startDate: undefined,
  endDate: undefined
}

const schema = z.object({
  company: z.string().optional(),
  consumer: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})

export type FilterData = z.infer<typeof schema>

export function CashbacksHistoric() {
  const toast = useToast(chakraToastConfig)
  const { register, handleSubmit, setValue } = useForm<FilterData>({
    resolver: zodResolver(schema),
    defaultValues: formInitialData
  })

  const { isOpen, onClose, onOpen } = useDisclosure()
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false)
  const [transactionIdCancel, setTransactionIdCancel] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const [cashbacks, setCashbacks] = useState<Paginated<Transaction>>({
    data: [],
    meta: { lastPage: 0 }
  })

  const [filters, setFilters] = useState<FilterProps>(formInitialData)

  const { data: status, isLoading: isLoadingStatus } = useSWR(
    'manager/cashback/find/status'
  )

  const { isLoading } = useSWR<Paginated<Transaction>>(
    [
      'manager/cashback/find',
      {
        page,
        ...filters,
        status: filters.status !== '0' ? filters.status : undefined
      }
    ],
    { onSuccess: data => setCashbacks(data) }
  )

  function onSubmit(data: FilterData) {
    setFilters({
      company: data?.company ? data.company : undefined,
      consumer: data?.consumer ? data.consumer : undefined,
      status: data?.status === '0' ? undefined : data?.status,
      startDate: data?.startDate ? data.startDate : undefined,
      endDate: data?.endDate ? data.endDate : undefined
    })
  }

  function resetFilters() {
    setValue('company', '')
    setValue('consumer', '')
    setValue('status', '0')
    setValue('startDate', '')
    setValue('endDate', '')

    setFilters(formInitialData)
  }

  function openCancelModal(id: number) {
    setTransactionIdCancel(id)
    setModalConfirmVisible(true)
  }

  function cancelTransaction() {
    setLoading(true)

    API.put(`/manager/cashback/cancel/${transactionIdCancel}`)
      .then(() => {
        setModalConfirmVisible(false)
        mutate([
          'manager/cashback/find',
          {
            page,
            ...filters,
            status: filters.status !== '0' ? filters.status : undefined
          }
        ])
        toast({
          title: 'Sucesso',
          description: 'Cashback cancelado com sucesso!',
          status: 'success'
        })
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
        toast({
          title: 'Atenção',
          description: error.response.data.message,
          status: 'error'
        })
      })
      .finally(() => {
        setTransactionIdCancel(0)
        setLoading(false)
      })
  }

  return (
    <Layout title="Histórico de cashbacks" p={4}>
      <Flex mb={4} align="center" justify="flex-end">
        <IconButton
          icon={<IoFilter />}
          isLoading={isLoadingStatus}
          colorScheme="blue"
          onClick={onOpen}
          aria-label="filtro"
        />
      </Flex>
      <AppTable
        dataLength={cashbacks?.data.length}
        noDataMessage="Nenhum cashback encontrado"
        overflowY="scroll"
        pagination={
          <Pagination
            page={page}
            isLoading={isLoading}
            setPage={setPage}
            lastPage={cashbacks?.meta.lastPage || 0}
          />
        }
      >
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Data da Emissão</Th>
            <Th>Status</Th>
            <Th>Empresa</Th>
            <Th>Cliente</Th>
            <Th>Valor</Th>
            <Th>Método de Pagamento</Th>
            <Th>Cashback</Th>
            <Th>Taxa Takeback</Th>
            <Th>Total a Pagar</Th>
            <Th isNumeric>ID</Th>
          </Tr>
        </Thead>
        <Tbody>
          {cashbacks?.data.map(cashback => (
            <Tr color="gray.500" key={cashback.id}>
              <Td>
                {TransactionStatusEnum.PENDING ===
                  cashback.transactionStatus.description && (
                  <IconButton
                    icon={<MdOutlineCancel />}
                    onClick={() => openCancelModal(cashback.id)}
                    aria-label="cancel"
                    size="sm"
                  />
                )}
              </Td>
              <Td>{new Date(cashback.createdAt).toLocaleString()}</Td>
              <Td>{cashback.transactionStatus.description}</Td>
              <Td>{cashback.company.fantasyName}</Td>
              <Td>{cashback.consumer.fullName}</Td>
              <Td>{currencyFormat(parseFloat(cashback.totalAmount))}</Td>
              <Td>
                {cashback.transactionPaymentMethods.length > 1
                  ? 'MÚLTIPLOS'
                  : cashback.transactionPaymentMethods[0]?.companyPaymentMethod
                      .paymentMethod.description ?? '-'}
              </Td>
              <Td>{currencyFormat(parseFloat(cashback.cashbackAmount))}</Td>
              <Td>{currencyFormat(parseFloat(cashback.takebackFeeAmount))}</Td>
              <Td>
                {currencyFormat(
                  parseFloat(cashback.cashbackAmount) +
                    parseFloat(cashback.takebackFeeAmount) +
                    parseFloat(cashback.backAmount)
                )}
              </Td>
              <Td>{cashback.id}</Td>
            </Tr>
          ))}
        </Tbody>
      </AppTable>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Flex gap={4} align="center">
              Filtros{' '}
              <Spinner display={isLoading ? 'block' : 'none'} size="xs" />
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={4}>
              <ChakraInput
                label="Nome fantasia ou CNPJ da empresa"
                size="sm"
                maxLength={40}
                minLength={3}
                {...register('company')}
              />

              <ChakraInput
                label="Nome ou CPF do cliente"
                size="sm"
                maxLength={40}
                minLength={3}
                {...register('consumer')}
              />
              {!!status && (
                <ChakraSelect
                  label="Status do cashback"
                  options={[...defaultSelect, ...status].map(i => ({
                    text: i.description,
                    value: i.id
                  }))}
                  {...register('status')}
                />
              )}

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

      <DefaultModalChakra
        title="Confime a operação"
        visible={modalConfirmVisible}
        onClose={() => setModalConfirmVisible(false)}
      >
        <S.ContainerModal>
          <S.ContentConfimModal>
            <S.Title>Confirma o cancelamento do cashback?</S.Title>
          </S.ContentConfimModal>
          <S.FooterModal>
            <QuartenaryButton
              label="Cancelar"
              color={PALLET.COLOR_17}
              type="button"
              onClick={() => setModalConfirmVisible(false)}
            />
            <QuartenaryButton
              label="Confirmar"
              color={PALLET.COLOR_08}
              type="button"
              loading={loading}
              onClick={cancelTransaction}
            />
          </S.FooterModal>
        </S.ContainerModal>
      </DefaultModalChakra>
    </Layout>
  )
}
