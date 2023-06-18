/* eslint-disable camelcase */
import React, { useContext, useState } from 'react'
import { IoCheckmark, IoTrashOutline } from 'react-icons/io5'
import Loader from 'react-spinners/PulseLoader'
import { useTheme } from 'styled-components'

import useSWR, { mutate as globalMutate } from 'swr'

import { currencyFormat } from '../../../utils/currencyFormat'

import { OutlinedButton } from '../../../components/buttons'
import { Layout } from '../../../components/ui/layout'

import { useDisclosure } from '@chakra-ui/react'
import { ConfirmationModal } from './ConfirmationModal'
import * as S from './styles'
import { BlockModal } from '../../../components/modals/BlockModal'
import { AuthContext } from '../../../contexts/AuthContext'
import { formatToDateTime } from '../../../utils'

enum SolicitationStatus {
  WAITING = 'WAITING',
  CANCELED = 'CANCELED',
  APPROVED = 'APPROVED'
}

export enum SolicitationType {
  CASHBACK = 'CASHBACK',
  PAYMENT = 'PAYMENT'
}

interface Solicitation {
  id: string
  status: SolicitationStatus
  type: SolicitationType
  createdAt: string
  valueInCents: number
  companyPaymentMethod: {
    id: number
    paymentMethod: {
      description: string
    }
  }
  consumer: {
    fullName: string
  }
}

const titleByType: { [key in SolicitationType]: string } = {
  CASHBACK: 'Solicitação de cashback',
  PAYMENT: 'Solicitação de pagamento'
}

const fontByType: {
  [key in SolicitationType]: { weight: string; size: string }
} = {
  CASHBACK: { weight: 'normal', size: '0.7rem' },
  PAYMENT: { weight: 'bold', size: '0.8rem' }
}

const textByStatus: { [key in SolicitationStatus]: string } = {
  APPROVED: 'Aprovado',
  CANCELED: 'Cancelado',
  WAITING: 'Aguardando'
}

interface SolicitationsProps {
  type: SolicitationType
}

export function Solicitations({ type }: SolicitationsProps) {
  const theme = useTheme()

  const { isOpen, onClose, onOpen } = useDisclosure()

  const { generateCashback } = useContext(AuthContext)

  const {
    data: solicitations,
    isLoading,
    mutate
  } = useSWR<Solicitation[]>(['company/solicitations', { type }])

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [isCancelation, setIsCancelation] = useState(false)

  // Adicionando ou removendo todas as transações ao array de transações
  const addOrRemoveAllItems = () => {
    if (!solicitations) return

    if (selectedIds.length === solicitations.length) {
      return setSelectedIds([])
    }

    setSelectedIds(solicitations.map(s => s.id))
  }

  // Adicionando ou removendo transação ao array de transações
  function addOrRemoveItem(id: string) {
    const index = selectedIds.indexOf(id)

    if (index === -1) {
      return setSelectedIds(state => [...state, id])
    }

    setSelectedIds(state => state.filter(i => i !== id))
  }

  if (isLoading || !solicitations) {
    return (
      <Layout title={titleByType[type]}>
        <S.ContainLoader>
          <Loader color="rgba(54, 162, 235, 1)" />
        </S.ContainLoader>
      </Layout>
    )
  }

  return (
    <>
      <Layout title={titleByType[type]}>
        <S.Container>
          {solicitations.length > 0 ? (
            <S.Content>
              <S.Table>
                <S.THead>
                  <S.Tr>
                    <S.Th>
                      <S.Checkbox
                        onChange={addOrRemoveAllItems}
                        checked={selectedIds.length === solicitations.length}
                      />
                    </S.Th>
                    <S.Th>Status</S.Th>
                    <S.Th>Tipo</S.Th>
                    <S.Th>Cliente</S.Th>
                    <S.Th>Valor</S.Th>
                    <S.Th>Forma de Pagamento</S.Th>
                    <S.Th>Data de Emissão</S.Th>
                  </S.Tr>
                </S.THead>
                <S.TBody>
                  {solicitations?.map((item, index) => (
                    <S.Tr key={index}>
                      <S.Td>
                        <S.Checkbox
                          checked={!!selectedIds.find(id => id === item.id)}
                          value={item.id}
                          onChange={() => addOrRemoveItem(item.id)}
                        />
                      </S.Td>
                      <S.Td
                        style={{
                          color: '#FD79A8',
                          fontWeight: fontByType[item.type].weight,
                          fontSize: fontByType[item.type].size
                        }}
                      >
                        {textByStatus[item.status]}
                      </S.Td>
                      <S.Td
                        style={{
                          fontWeight: fontByType[item.type].weight,
                          fontSize: fontByType[item.type].size
                        }}
                      >
                        {titleByType[item.type]}
                      </S.Td>
                      <S.Td>{item.consumer.fullName}</S.Td>
                      <S.Td>{currencyFormat(item.valueInCents / 100)}</S.Td>
                      <S.Td>
                        {item.companyPaymentMethod.paymentMethod.description}
                      </S.Td>
                      <S.Td
                        style={{
                          fontWeight: fontByType[item.type].weight,
                          fontSize: fontByType[item.type].size
                        }}
                      >
                        {formatToDateTime(item.createdAt)}
                      </S.Td>
                    </S.Tr>
                  ))}
                </S.TBody>
              </S.Table>
            </S.Content>
          ) : (
            <S.NoCashbacksMessageContent>
              <S.NoCashbacksMessage>
                Nenhuma solicitação de cashback
              </S.NoCashbacksMessage>
            </S.NoCashbacksMessageContent>
          )}
        </S.Container>

        <S.Footer visibility={selectedIds.length > 0}>
          <S.ButtonsWrapper>
            <OutlinedButton
              color={theme.colors['red-500']}
              onClick={() => {
                setIsCancelation(true)
                onOpen()
              }}
            >
              <IoTrashOutline style={{ fontSize: 20 }} />
              <span>Cancelar</span>
            </OutlinedButton>

            <OutlinedButton
              color={theme.colors['blue-700']}
              onClick={() => {
                setIsCancelation(false)
                onOpen()
              }}
            >
              <IoCheckmark style={{ fontSize: 20 }} />
              <span>Reconhecer</span>
            </OutlinedButton>
          </S.ButtonsWrapper>
        </S.Footer>

        <ConfirmationModal
          isOpen={isOpen}
          onClose={onClose}
          handleConfirmation={() => {
            mutate()
            globalMutate('company/waiting-solicitations')
            setSelectedIds([])
          }}
          selectedIds={selectedIds}
          isCancelation={isCancelation}
        />
      </Layout>

      <BlockModal
        title="Sem permissão para aceitar ou rejeitar cashbacks solicitados"
        isOpen={!generateCashback}
      />
    </>
  )
}
