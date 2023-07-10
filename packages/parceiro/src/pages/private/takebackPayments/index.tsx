/* eslint-disable camelcase */
import React, { useState } from 'react'
import Loader from 'react-spinners/PulseLoader'
import { useTheme } from 'styled-components'

import { Layout } from '../../../components/ui/layout'
import { currencyFormat } from '../../../utils/currencyFormat'

import useSWR from 'swr'

import { IconButton, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'
import * as S from './styles'
import { FiRotateCw } from 'react-icons/fi'
import {
  ChargebackModalButton,
  chargebackTransaction
} from '../../../components/modals/ChargebackModalButton'
import { on } from 'events'

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

interface Response {
  cashbacks: Transaction[]
}

export const TakebackPayments: React.FC = () => {
  const [transactionId, setTransactionId] = useState<number>()
  const toast = useToast(chakraToastOptions)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data, isLoading, mutate } = useSWR<Response>([
    '/company/cashbacks/find/all/0/30',
    { statusId: 3 }
  ])

  function selectTransaction(transactionId: number) {
    setTransactionId(transactionId)
    onOpen()
  }

  async function handleSubmit() {
    if (!transactionId) return

    const [isOk, response] = await chargebackTransaction(transactionId)

    if (!isOk) {
      return toast({
        title: 'Atenção',
        description: response.message,
        status: 'error'
      })
    }

    toast({
      title: 'Sucesso',
      description: response.message,
      status: 'success'
    })

    await mutate()

    onClose()
  }

  return (
    <Layout title="Conferencia de Pagamentos">
      {isLoading ? (
        <S.ContainLoader>
          <Loader color="rgba(54, 162, 235, 1)" />
        </S.ContainLoader>
      ) : (
        <S.Container>
          {data?.cashbacks.length ? (
            <S.Table>
              <S.THead>
                <S.Tr>
                  <S.Th>ID</S.Th>
                  <S.Th>Status</S.Th>
                  <S.Th>Cliente</S.Th>
                  <S.Th>Vendedor</S.Th>
                  <S.Th>Valor da Compra</S.Th>
                  <S.Th>Método de Pagamento</S.Th>
                  <S.Th>Data de Emissão</S.Th>
                  <S.Th></S.Th>
                </S.Tr>
              </S.THead>
              <S.TBody>
                {data?.cashbacks.map((item, index) => (
                  <S.Tr key={index}>
                    <S.Td>{item.id}</S.Td>
                    <S.Td style={{ color: '#FD79A8' }}>
                      {item.transactionStatus.description}
                    </S.Td>
                    <S.Td>{item.consumer.fullName}</S.Td>
                    <S.Td>{item.companyUser?.name ?? '-'}</S.Td>
                    <S.Td>{currencyFormat(parseFloat(item.totalAmount))}</S.Td>
                    <S.Td>
                      {item.transactionPaymentMethods.length > 1
                        ? 'MÚLTIPLOS'
                        : item.transactionPaymentMethods[0]
                            ?.companyPaymentMethod.paymentMethod.description ??
                          '-'}
                    </S.Td>

                    <S.Td>{new Date(item.createdAt).toLocaleString()}</S.Td>
                    <S.Td>
                      <Tooltip label="Estornar" aria-label="Estornar">
                        <IconButton
                          size="sm"
                          onClick={() => selectTransaction(item.id)}
                          colorScheme="orange"
                          icon={<FiRotateCw />}
                          aria-label="Estornar"
                        />
                      </Tooltip>
                    </S.Td>
                  </S.Tr>
                ))}
              </S.TBody>
            </S.Table>
          ) : (
            <S.NoCashbacksMessageContent>
              <S.NoCashbacksMessage>Nenhum pagamento</S.NoCashbacksMessage>
            </S.NoCashbacksMessageContent>
          )}
        </S.Container>
      )}
      <ChargebackModalButton
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
      />
    </Layout>
  )
}
