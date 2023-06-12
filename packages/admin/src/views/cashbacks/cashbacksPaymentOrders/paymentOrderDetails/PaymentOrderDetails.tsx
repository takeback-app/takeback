/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import Lottie from 'react-lottie'

import { API } from '../../../../services/API'
import { currencyFormat } from '../../../../utils/currencytFormat'

import Layout from '../../../../components/ui/Layout'
import PageLoader from '../../../../components/loaders/primaryLoader'
import DisplayInfo from '../../../../components/ui/DisplayInfo'
import QuartenaryButton from '../../../../components/buttons/QuartenaryButton'
import { notifyError } from '../../../../components/ui/Toastify'

import CheckAnimation from '../../../../assets/check.json'
import PALLET from '../../../../styles/ColorPallet'
import * as S from './styles'
import { DefaultModalChakra } from '../../../../components/modals/DefaultModal/DefaultModalChakra'

interface PaymentOrderTypes {
  paymentOrder_id: number
  paymentOrder_value: number
  paymentOrder_approvedAt?: string
  paymentOrder_createdAt: string
  paymentStatus_description: string
  paymentMethod_description: string
  company_fantasyName: string
}

interface TransactionTypes {
  transaction_id: number
  transaction_totalAmount: string
  transaction_takebackFeeAmount: string
  transaction_cashbackAmount: string
  transaction_createdAt: Date
  consumer_fullName: string
  status_description: string
}

const PaymentOrderDetails: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigateTo = useNavigate()
  const { id } = useParams()

  const [paymentOrderDetails, setPaymentOrderDetails] = useState(
    {} as PaymentOrderTypes
  )
  const [transactions, setTransactions] = useState(
    [] as Array<TransactionTypes>
  )

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [modalNotifyVisible, setModalNotifyVisible] = useState(false)
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false)

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: CheckAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  const findPaymentOrderDetails = () => {
    API.get(`/manager/orders/find/${id}`)
      .then(response => {
        setPaymentOrderDetails(response.data.details)
        setTransactions(response.data.transactions)
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  const approveOrderAndReleaseCashbacks = () => {
    setLoading(true)
    API.put(`/manager/order/approve/${paymentOrderDetails.paymentOrder_id}`)
      .then(() => {
        setModalConfirmVisible(false)
        setModalNotifyVisible(true)
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    findPaymentOrderDetails()
  }, [])

  return (
    <Layout
      goBack={() => navigateTo(-1)}
      goBackTitle={`Detalhes da ordem de pagamento N° ${id}`}
    >
      {pageLoading ? (
        <PageLoader label="Carregando detalhes" />
      ) : (
        <S.Container>
          <S.Content>
            <DisplayInfo
              label="Parceiro"
              value={paymentOrderDetails.company_fantasyName}
            />
            <DisplayInfo
              label="Valor"
              value={currencyFormat(
                paymentOrderDetails.paymentOrder_value || 0
              )}
            />
            <DisplayInfo
              label="Forma de pagamento"
              value={paymentOrderDetails.paymentMethod_description}
            />
            <DisplayInfo
              label="Status"
              value={paymentOrderDetails.paymentStatus_description}
            />
            <DisplayInfo
              label="Data da solicitação"
              value={new Date(
                paymentOrderDetails.paymentOrder_createdAt
              ).toLocaleDateString()}
            />
            {paymentOrderDetails.paymentOrder_approvedAt && (
              <DisplayInfo
                label="Data da confirmação/cancelamento"
                value={new Date(
                  paymentOrderDetails.paymentOrder_approvedAt
                ).toLocaleDateString()}
              />
            )}
          </S.Content>
          {paymentOrderDetails.paymentStatus_description !== 'Cancelada' && (
            <S.TransactionsWrapper>
              <h4>Cashbacks referentes</h4>
              <S.Table>
                <S.THead>
                  <S.Tr>
                    <S.Th>N° Transação</S.Th>
                    <S.Th>Status</S.Th>
                    <S.Th>Cliente</S.Th>
                    <S.Th>Valor da Compra</S.Th>
                    <S.Th>Cashback</S.Th>
                    <S.Th>Taxa Takeback</S.Th>
                    <S.Th>Total a Pagar</S.Th>
                    <S.Th>Data de Emissão</S.Th>
                  </S.Tr>
                </S.THead>
                <S.TBody>
                  {transactions?.map(item => (
                    <S.Tr key={item.transaction_id}>
                      <S.Td>{item.transaction_id}</S.Td>
                      <S.Td style={{ color: '#FD79A8' }}>
                        {item.status_description}
                      </S.Td>
                      <S.Td>{item.consumer_fullName}</S.Td>
                      <S.Td>
                        {currencyFormat(
                          parseFloat(item.transaction_totalAmount)
                        )}
                      </S.Td>
                      <S.Td>
                        {currencyFormat(
                          parseFloat(item.transaction_cashbackAmount)
                        )}
                      </S.Td>
                      <S.Td>
                        {currencyFormat(
                          parseFloat(item.transaction_takebackFeeAmount)
                        )}
                      </S.Td>
                      <S.Td>
                        {currencyFormat(
                          parseFloat(item.transaction_cashbackAmount) +
                            parseFloat(item.transaction_takebackFeeAmount)
                        )}
                      </S.Td>
                      <S.Td>
                        {new Date(
                          item.transaction_createdAt
                        ).toLocaleDateString()}
                      </S.Td>
                    </S.Tr>
                  ))}
                </S.TBody>
              </S.Table>
            </S.TransactionsWrapper>
          )}
        </S.Container>
      )}

      <S.Footer
        visibility={
          paymentOrderDetails.paymentStatus_description ===
          'Aguardando confirmacao'
        }
      >
        <S.TotalValue>
          Valor: {currencyFormat(paymentOrderDetails.paymentOrder_value || 0)}
        </S.TotalValue>
        <S.ButtonsWrapper>
          <QuartenaryButton
            label="Confirmar o recebimento"
            color={PALLET.COLOR_05}
            icon={IoCheckmarkCircleOutline}
            onClick={() => setModalConfirmVisible(true)}
          />
        </S.ButtonsWrapper>
      </S.Footer>

      <DefaultModalChakra
        title="Confime a operação"
        visible={modalConfirmVisible}
        onClose={() => setModalConfirmVisible(false)}
      >
        <S.ContainerModal>
          <S.ContentConfimModal>
            <S.Title>
              Confirma o recebimento do valor{' '}
              {currencyFormat(paymentOrderDetails.paymentOrder_value || 0)}?
            </S.Title>
            <S.Label>
              Ao confirmar, os cashbacks contidos nessa ordem de pagamento,
              serão liberados para os clientes e o saldo negativo do parceiro
              será abatido no respectivo valor.
            </S.Label>
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
              onClick={approveOrderAndReleaseCashbacks}
            />
          </S.FooterModal>
        </S.ContainerModal>
      </DefaultModalChakra>

      <DefaultModalChakra visible={modalNotifyVisible}>
        <S.ModalConfirmMain>
          <Lottie
            options={defaultOptions}
            height={200}
            width={200}
            isStopped={false}
            isPaused={false}
            isClickToPauseDisabled
          />
          <h5>Cashbacks liberados!</h5>
        </S.ModalConfirmMain>
        <S.ModalFooter>
          <QuartenaryButton
            label="OK"
            color={PALLET.COLOR_08}
            type="button"
            onClick={() => navigateTo('/cashbacks/pagamentos')}
          />
        </S.ModalFooter>
      </DefaultModalChakra>
    </Layout>
  )
}

export default PaymentOrderDetails
