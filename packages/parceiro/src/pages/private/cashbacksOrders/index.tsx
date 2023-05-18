/* eslint-disable camelcase */

import React, { useContext, useEffect, useState } from 'react'
import {
  IoTrashOutline,
  IoCheckmarkOutline,
  IoEyeOutline
} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import Loader from 'react-spinners/PulseLoader'
import { useTheme } from 'styled-components'

import { API } from '../../../services/API'
import { CData } from '../../../contexts/CData'
import { currencyFormat } from '../../../utils/currencyFormat'
import { OutlinedButton } from '../../../components/buttons'
import { DefaultModal } from '../../../components/modals/defaultModal'
import { Layout } from '../../../components/ui/layout'

import * as S from './styles'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

export const PaymentOrders: React.FC = () => {
  const theme = useTheme()
  const toast = useToast(chakraToastOptions)

  const [loading, setLoading] = useState(false)
  const [isLoadingPage, setIsLoadingPage] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [offset, setOffSet] = useState(1)
  const [endList, setEndList] = useState(false)
  const [modalCancelVisible, setModalCancelVisible] = useState(false)
  const [modalCancelMessage, setModalCancelMessage] = useState('')
  const [orderId, setOrderId] = useState(0)
  const { paymentOrders, setPaymentOrders } = useContext(CData)

  const navigateTo = useNavigate()

  const findOrders = () => {
    setLoading(true)
    API.get('/company/order/find/all/0/30')
      .then(response => {
        if (response.data.length < 30) {
          setEndList(true)
        }
        setPaymentOrders(response.data)
        setIsLoadingPage(false)
      })
      .catch(error => {
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getMoreData = () => {
    setMoreLoading(true)
    API.get(`/company/order/find/all/${offset}/30`)
      .then(response => {
        if (response.data.length < 30) {
          setMoreLoading(false)
          setEndList(true)
        }

        setOffSet(offset + 1)
        setPaymentOrders([...paymentOrders, ...response.data])
        setMoreLoading(false)
      })
      .catch(error => {
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
  }

  const cancelOrderModal = (index: number) => {
    setOrderId(paymentOrders[index].order_id)
    setModalCancelVisible(true)
    setModalCancelMessage(
      `Confirma o cancelamento da Ordem n° ${
        paymentOrders[index].order_id
      }, no valor de ${currencyFormat(paymentOrders[index].order_value) || 0} ?`
    )
  }

  const cancelOrder = () => {
    setLoading(true)
    API.put(`company/order/payment/cancel/${orderId}`)
      .then(() => {
        toast({
          title: 'Sucesso!',
          description: 'Ordem de pagamento cancelada',
          status: 'success'
        })
      })
      .catch(error => {
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
      .finally(() => {
        findOrders()
        setModalCancelVisible(false)
      })
  }

  useEffect(() => {
    findOrders()
    // eslint-disable-next-line
  }, [])

  return (
    <Layout title="Ordens de Pagamento">
      {isLoadingPage ? (
        <S.ContainLoader>
          <Loader color="rgba(54, 162, 235, 1)" />
        </S.ContainLoader>
      ) : (
        <S.Container>
          <S.SubHeader></S.SubHeader>
          {paymentOrders.length > 0 ? (
            <S.Table>
              <S.THead>
                <S.Tr>
                  <S.Th>ID</S.Th>
                  <S.Th>Método de Pagamento</S.Th>
                  <S.Th>Valor Total</S.Th>
                  <S.Th>Status</S.Th>
                  <S.Th>Data de Emissão</S.Th>
                  <S.Th></S.Th>
                </S.Tr>
              </S.THead>

              <S.TBody>
                {paymentOrders.map((item, index) => (
                  <S.Tr key={index}>
                    <S.Td>{item.order_id}</S.Td>
                    <S.Td>{item.paymentMethod_description}</S.Td>
                    <S.Td>{currencyFormat(item.order_value)}</S.Td>
                    <S.Td>{item.status_description}</S.Td>
                    <S.Td>
                      {new Date(item.order_createdAt).toLocaleDateString()}
                    </S.Td>
                    <S.Td>
                      <S.ButtonWrapper>
                        {item.status_description ===
                          'Aguardando confirmacao' && (
                          <OutlinedButton
                            color={theme.colors['red-400']}
                            style={{
                              height: 'auto',
                              padding: '0.46rem 0.8rem'
                            }}
                            onClick={() => cancelOrderModal(index)}
                          >
                            <IoTrashOutline />
                          </OutlinedButton>
                        )}

                        <OutlinedButton
                          color={theme.colors['blue-600']}
                          style={{
                            height: 'auto',
                            padding: '0.46rem 0.8rem'
                          }}
                          onClick={() =>
                            navigateTo(`/cashbacks/pagamentos/${index}`)
                          }
                        >
                          <IoEyeOutline />
                        </OutlinedButton>
                      </S.ButtonWrapper>
                    </S.Td>
                  </S.Tr>
                ))}
              </S.TBody>
            </S.Table>
          ) : (
            <S.NoCashbacksMessageContent>
              <S.NoCashbacksMessage>
                Nenhuma ordem de pagamento
              </S.NoCashbacksMessage>
            </S.NoCashbacksMessageContent>
          )}

          {!endList && (
            <S.Footer>
              <S.LoadMoreButton onClick={getMoreData}>
                {moreLoading ? (
                  <Loader color="#3A4D5C" size="0.6rem" />
                ) : (
                  'Carregar mais'
                )}
              </S.LoadMoreButton>
            </S.Footer>
          )}
        </S.Container>
      )}

      <DefaultModal
        title="CONFIRME O CANCELAMENTO"
        visible={modalCancelVisible}
        onClose={() => setModalCancelVisible(false)}
      >
        <S.ContentMessageModal>
          <S.Message>{modalCancelMessage}</S.Message>
        </S.ContentMessageModal>
        <S.FooterModal>
          <OutlinedButton
            color={theme.colors['blue-700']}
            onClick={cancelOrder}
            loading={loading}
            disabled={loading}
          >
            <IoCheckmarkOutline style={{ fontSize: 20 }} />
            <span>Confirmar</span>
          </OutlinedButton>
        </S.FooterModal>
      </DefaultModal>
    </Layout>
  )
}
