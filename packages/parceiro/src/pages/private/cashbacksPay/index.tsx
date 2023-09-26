/* eslint-disable camelcase */
import React, { useEffect, useState, useContext, useMemo } from 'react'
import Loader from 'react-spinners/PulseLoader'
import {
  IoCardOutline,
  IoCheckmarkOutline,
  IoCopy,
  IoReaderOutline,
  IoRepeatOutline,
  IoSparklesOutline,
  IoTrashOutline,
  IoWalletOutline
} from 'react-icons/io5'
import { IoLogoUsd } from 'react-icons/io'
import { BsUpcScan } from 'react-icons/bs'
import { useTheme } from 'styled-components'

import { API } from '../../../services/API'
import { CData } from '../../../contexts/CData'
import { currencyFormat } from '../../../utils/currencyFormat'

import { Layout } from '../../../components/ui/layout'
import { DefaultModal } from '../../../components/modals/defaultModal'
import { PrimaryCard } from '../../../components/cards/primaryCard'
import { SmallCardButton } from '../../../components/cards/smallCardButton'
import { OutlinedButton } from '../../../components/buttons'

import * as S from './styles'
import {
  Button,
  useDisclosure,
  useToast,
  Heading,
  Text,
  Badge
} from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'
import { ChakraInput } from '../../../components/inputs/ChakraInput'
import { ValidationNfce } from './components/ValidationNfce'
import { FiFilter } from 'react-icons/fi'
import { FilterDrawer } from './components/FilterDrawer'
import { useCashbackPay } from './state'
import { PixQRCode } from 'pix-react'
import { TransactionSourceEnum } from '../../../enums/TransactionSource.enum'

export type NfceValidationStatus = 'IN_PROGRESS' | 'NOT_FOUND' | 'VALIDATED'

interface CmmSells {
  sellId: string
}

interface TransactionProps {
  id: number
  totalAmount: string
  takebackFeeAmount: string
  cashbackAmount: string
  backAmount: string
  createdAt: Date
  transactionPaymentMethods: TransactionPaymentMethod[]
  nfceValidationStatus: NfceValidationStatus
  nfce: string | null
  consumer: {
    fullName: string
  }
  transactionStatus: {
    description: string
  }
  companyUser: {
    name: string
  }
  qrCodeId: string | null
  transactionSource: TransactionSourceEnum
  cmmSells?: CmmSells[]
}

interface TransactionPaymentMethod {
  companyPaymentMethod: {
    paymentMethod: {
      description: string
    }
  }
}

let cashbacksSelected: Array<number> = []
const localColors = ['#0984E3', '#2f9d94', '#cc0066', '#00cc00']
const icons = [IoLogoUsd, IoSparklesOutline, BsUpcScan, IoReaderOutline]

export const Cashback: React.FC = () => {
  const theme = useTheme()
  const toast = useToast(chakraToastOptions)

  const { type: typeFilter, setForm: setFilterForm } = useCashbackPay()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    paymentMethodsOrder,
    setPaymentMethodsOrder,
    companyData,
    setCompanyData
  } = useContext(CData)

  const [allTransactions, setAllTransactions] = useState<TransactionProps[]>([])
  const [total, setTotal] = useState(0)
  const [allChecked, setAllChecked] = useState(false)
  const [hasIntegration, setHasIntegration] = useState(false)
  const [useQRCode, setUseQRCode] = useState(false)
  const [useCMM, setUseCMM] = useState(false)

  const [modalCancelVisible, setModalCancelVisible] = useState(false)
  const [modalPaymentVisible, setModalPaymentVisible] = useState(false)
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false)
  const [modalPixVisible, setModalPixVisible] = useState(false)

  const [modalConfirmMessage, setModalConfirmMessage] = useState('')
  const [modalInfoMessage, setModalInfoMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [cancellationDescription, setCancellationDescription] = useState('')

  const [isPixMethod, setIsPixMethod] = useState(false)
  const [paymentMethodId, setPaymentMethodId] = useState(0)
  const [pixKey, setPixKey] = useState('')

  const [pageLoading, setPageLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)

  const transactions = useMemo(() => {
    if (typeFilter === 'ALL') return allTransactions

    return allTransactions.filter(t => t.nfceValidationStatus === typeFilter)
  }, [allTransactions, typeFilter])

  // Buscanco os cashbacks da empresa com o status de pendente
  const findCashbacks = () => {
    API.get('/company/cashbacks/find/pending')
      .then(response => {
        setAllTransactions(response.data.cashbacks)
        setHasIntegration(response.data.hasIntegration)
        setPageLoading(false)
      })
      .catch(error => {
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  // Adicionando ou removendo todas as transações ao array de transações
  const addOrRemoveAllItems = () => {
    let value = 0

    if (allChecked) {
      setTotal(0)
      cashbacksSelected = []
      setAllChecked(false)
    } else {
      transactions.map(item => {
        cashbacksSelected.push(item.id)
        return (value =
          value +
          parseFloat(item.cashbackAmount) +
          parseFloat(item.takebackFeeAmount) +
          parseFloat(item.backAmount))
      })

      setTotal(value)
      setAllChecked(true)
    }
  }

  // Adicionando ou removendo transação ao array de transações
  const addOrRemoveItem = (id: number, value: number) => {
    if (cashbacksSelected.includes(id)) {
      setTotal(total - value)
      return cashbacksSelected.splice(cashbacksSelected.indexOf(id), 1)
    }

    cashbacksSelected.push(id)
    setTotal(total + value)
  }

  // Cancelando cashbacks
  const handleCancelCashbacks = () => {
    if (cancellationDescription.length === 0) {
      return toast({
        title: 'Atenção!',
        description: 'Informe o motivo do cancelamento',
        status: 'warning'
      })
    }

    setButtonLoading(true)
    API.put('/company/cashback/cancel', {
      cancellationDescription,
      transactionIDs: cashbacksSelected
    })
      .then(response => {
        setAllTransactions(response.data)
        cashbacksSelected = []
        setTotal(0)

        toast({
          title: 'Sucesso!',
          description:
            cashbacksSelected.length > 1
              ? 'Cashbacks cancelados'
              : 'Cashback cancelado',
          status: 'info'
        })

        cashbacksSelected.length = 0
        setModalCancelVisible(false)
        setAllChecked(false)
      })
      .catch(error => {
        if (error.isAxiosError) {
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
        }
      })
      .finally(() => {
        setButtonLoading(false)
      })
  }

  const selectPaymentType = (id: number) => {
    if (id === 1) {
      if (total > companyData.positiveBalance) {
        return toast({
          title: 'Sem saldo!',
          description: 'Seu saldo não é sufiente.',
          status: 'info'
        })
      }

      setPaymentMethodId(id)
      setModalConfirmMessage(
        `Deseja abater ${currencyFormat(total)} do seu saldo no TakeBack?`
      )
      setModalInfoMessage(
        'Com esse método, o cashback será liberado instantaneamente para os clientes.'
      )
      setModalConfirmVisible(true)
      setModalPaymentVisible(false)
    } else if (id === 2) {
      setPaymentMethodId(id)

      setModalConfirmMessage(
        `Deseja pagar ${currencyFormat(total)} com o método PIX?`
      )
      setModalInfoMessage(
        'Ao confirmar, você terá acesso a chave PIX para afetuar o pagamento. Também enviaremos as informações de pagamento no seu e-mail. Pode levar algumas horas para que seja confirmado o recebimento.'
      )
      setIsPixMethod(true)
      setModalConfirmVisible(true)
      setModalPaymentVisible(false)
    } else if (id === 3) {
      setPaymentMethodId(id)

      setModalConfirmMessage(
        `Deseja pagar ${currencyFormat(total)} com o método Boleto?`
      )
      setModalInfoMessage(
        'Será gerado um boleto e você o receberá em seu email em até 3 dias úteis, e o cashback será liberado para os clientes assim que a TakeBack receber a confirmação do pagamento do boleto.'
      )
      setModalConfirmVisible(true)
      setModalPaymentVisible(false)
    }
  }

  const toggleModalConfirmVisible = () => {
    setIsPixMethod(false)
    setModalConfirmVisible(false)
    setModalPaymentVisible(true)
  }

  const openPixModal = () => {
    generatePaymentOrder()
    setModalConfirmVisible(false)
    setModalPixVisible(true)
  }

  // Gerando uma nova ordem de pagamento
  const generatePaymentOrder = () => {
    setButtonLoading(true)
    API.post('/company/order/payment/generate', {
      transactionIDs: cashbacksSelected,
      paymentMethodId
    })
      .then(response => {
        setSuccessMessage(response.data.message)
        setCompanyData(response.data.companyData)
        setAllTransactions(response.data.transactions)
        setModalConfirmVisible(false)
        setIsPixMethod(false)
        cashbacksSelected = []
        setAllChecked(false)
        toast({
          title: 'Sucesso',
          description: response.data.message,
          status: 'success'
        })
      })
      .catch(error => {
        if (error.isAxiosError) {
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
        }
      })
      .finally(() => {
        setButtonLoading(false)
      })
  }

  // Buscando os métodos de pagamento aceitos
  const getPaymentOrderMethods = () => {
    API.get('/company/order/payment/methods/findAll').then(response => {
      setPaymentMethodsOrder(response.data.methods)
      setPixKey(response.data.pixSettings.takebackPixKey)
    })
  }

  const getIntegrations = () => {
    API.get('/company/integrations/type').then(response => {
      setUseQRCode(response.data.useQRCode)
      setUseCMM(response.data.useCMM)
    })
  }

  const getCompanyData = () => {
    API.get('/company/data/find').then(response => {
      setCompanyData(response.data)
    })
  }

  // Finaliza a operação de pagamento das transações
  const closeModalPix = () => {
    setModalPixVisible(false)
    setTotal(0)
    setSuccessMessage('')
    toast({
      title: 'Sucesso :)',
      description: successMessage,
      status: 'success'
    })
  }

  // Copia a chave pix para a área de transferência
  const copyText = (pixKey: string) => {
    navigator.clipboard.writeText(pixKey).then(() => {
      toast({
        title: 'Chave copiada!',
        status: 'info'
      })
    })
  }

  useEffect(() => {
    cashbacksSelected = []
    findCashbacks()
    getIntegrations()
    getCompanyData()
    getPaymentOrderMethods()

    return () => {
      setFilterForm({ type: 'ALL' })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout title="Cashbacks à Pagar">
      {pageLoading ? (
        <S.ContainLoader>
          <Loader color="rgba(54, 162, 235, 1)" />
        </S.ContainLoader>
      ) : (
        <>
          <S.Container>
            <S.Header>
              <SmallCardButton
                icon={IoWalletOutline}
                title={`Saldo no TakeBack ${currencyFormat(
                  companyData.positiveBalance
                )}`}
                color="#009900"
              />
              <Button
                leftIcon={<FiFilter />}
                onClick={onOpen}
                colorScheme="teal"
              >
                Filtro
              </Button>
            </S.Header>

            {transactions.length > 0 ? (
              <S.Content>
                <S.Table>
                  <S.THead>
                    <S.Tr>
                      <S.Th>
                        <S.Checkbox
                          onChange={addOrRemoveAllItems}
                          checked={allChecked}
                        />
                      </S.Th>
                      <S.Th>Id</S.Th>
                      <S.Th>Status</S.Th>
                      <S.Th>Cliente</S.Th>
                      <S.Th>Vendedor</S.Th>
                      {/* {hasIntegration && <S.Th>Validação por NFC-e</S.Th>} */}
                      {useQRCode && <S.Th>Solicitado via QRCode</S.Th>}
                      {useCMM && <S.Th>Número de Venda</S.Th>}
                      <S.Th>Valor da Compra</S.Th>
                      <S.Th>Método de Pagamento</S.Th>
                      <S.Th>Cashback</S.Th>
                      <S.Th>Taxa Takeback</S.Th>
                      <S.Th>Troco</S.Th>
                      <S.Th>Total a Pagar</S.Th>
                      <S.Th>Origem</S.Th>
                      <S.Th>Data de Emissão</S.Th>
                    </S.Tr>
                  </S.THead>
                  <S.TBody>
                    {transactions?.map((item, index) => (
                      <S.Tr key={index}>
                        <S.Td>
                          <S.Checkbox
                            checked={cashbacksSelected.includes(item.id)}
                            value={item.id}
                            onChange={() =>
                              addOrRemoveItem(
                                item.id,
                                parseFloat(item.cashbackAmount) +
                                  parseFloat(item.takebackFeeAmount) +
                                  parseFloat(item.backAmount)
                              )
                            }
                          />
                        </S.Td>
                        <S.Td>{item.id}</S.Td>
                        <S.Td style={{ color: '#FD79A8' }}>
                          {item.transactionStatus.description}
                        </S.Td>
                        <S.Td>{item.consumer?.fullName ?? '-'}</S.Td>
                        <S.Td>{item.companyUser?.name ?? '-'}</S.Td>
                        {/* {hasIntegration && (
                          <S.Td>
                            <ValidationNfce
                              nfceValidationStatus={item.nfceValidationStatus}
                            />
                          </S.Td>
                        )} */}
                        {useQRCode && (
                          <S.Td>
                            <Badge
                              colorScheme={item.qrCodeId ? 'green' : 'yellow'}
                            >
                              {item.qrCodeId ? 'Sim' : 'Não'}
                            </Badge>
                          </S.Td>
                        )}
                        {useCMM && (
                          <S.Td>
                            {item.cmmSells?.length
                              ? item.cmmSells[0].sellId
                              : ''}
                          </S.Td>
                        )}
                        <S.Td>
                          {currencyFormat(parseFloat(item.totalAmount))}
                        </S.Td>
                        <S.Td>
                          {item.transactionPaymentMethods.length > 1
                            ? 'MÚLTIPLOS'
                            : item.transactionPaymentMethods[0]
                                ?.companyPaymentMethod.paymentMethod
                                .description ?? '-'}
                        </S.Td>
                        <S.Td>
                          {currencyFormat(parseFloat(item.cashbackAmount))}
                        </S.Td>
                        <S.Td>
                          {currencyFormat(parseFloat(item.takebackFeeAmount))}
                        </S.Td>
                        <S.Td>
                          {currencyFormat(parseFloat(item.backAmount))}
                        </S.Td>
                        <S.Td>
                          {currencyFormat(
                            parseFloat(item.cashbackAmount) +
                              parseFloat(item.takebackFeeAmount) +
                              parseFloat(item.backAmount)
                          )}
                        </S.Td>
                        <S.Td style={{ textTransform: 'capitalize' }}>
                          {item.transactionSource
                            ? item.transactionSource.toLowerCase()
                            : '-'}
                        </S.Td>
                        <S.Td>{new Date(item.createdAt).toLocaleString()}</S.Td>
                      </S.Tr>
                    ))}
                  </S.TBody>
                </S.Table>
              </S.Content>
            ) : (
              <S.NoCashbacksMessageContent>
                <S.NoCashbacksMessage>
                  Nenhum cashback pendente
                </S.NoCashbacksMessage>
              </S.NoCashbacksMessageContent>
            )}
          </S.Container>

          <S.Footer visibility={cashbacksSelected.length > 0}>
            <S.TotalValue>Total: {currencyFormat(total)}</S.TotalValue>
            <S.ButtonsWrapper>
              <OutlinedButton
                color={theme.colors['red-500']}
                onClick={() => setModalCancelVisible(true)}
              >
                <IoTrashOutline style={{ fontSize: 20 }} />
                <span>Cancelar</span>
              </OutlinedButton>

              <OutlinedButton
                color={theme.colors['blue-700']}
                onClick={() => setModalPaymentVisible(true)}
              >
                <IoCardOutline style={{ fontSize: 20 }} />
                <span>Pagar</span>
              </OutlinedButton>
            </S.ButtonsWrapper>
          </S.Footer>

          <DefaultModal
            title="Cancelar cashbacks"
            visible={modalCancelVisible}
            onClose={() => setModalCancelVisible(false)}
          >
            <S.ModalContent>
              <S.ContentModal>
                <ChakraInput
                  name="cancellationDescription"
                  label="Informe o motivo do cancelamento"
                  onChange={e =>
                    setCancellationDescription(e.currentTarget.value)
                  }
                />
              </S.ContentModal>

              <S.ModalFooter>
                <OutlinedButton
                  onClick={handleCancelCashbacks}
                  color={theme.colors['red-500']}
                  type="submit"
                >
                  <IoTrashOutline style={{ fontSize: 20 }} />
                  <span>Cancelar cashbacks</span>
                </OutlinedButton>
              </S.ModalFooter>
            </S.ModalContent>
          </DefaultModal>

          <DefaultModal
            title="Selecione a forma de pagamento"
            visible={modalPaymentVisible}
            onClose={() => setModalPaymentVisible(false)}
          >
            <S.ContentModal>
              {paymentMethodsOrder?.map((item, index) => (
                <PrimaryCard
                  key={index}
                  title={item.methods_description}
                  color={localColors[index]}
                  icon={icons[index]}
                  onClick={() => selectPaymentType(item.methods_id)}
                />
              ))}
            </S.ContentModal>
          </DefaultModal>

          <DefaultModal
            title="Confirme o pagamento"
            visible={modalConfirmVisible}
            onClose={() => setModalConfirmVisible(false)}
          >
            <S.ModalContent>
              <S.ContentMessageModal>
                <S.Message>{modalConfirmMessage}</S.Message>
                <S.InfoMessage>{modalInfoMessage}</S.InfoMessage>
              </S.ContentMessageModal>
              <S.ModalFooter>
                {!buttonLoading && (
                  <OutlinedButton
                    color={theme.colors['blue-700']}
                    onClick={toggleModalConfirmVisible}
                  >
                    <IoRepeatOutline style={{ fontSize: 20 }} />
                    <span>Métodos</span>
                  </OutlinedButton>
                )}

                {isPixMethod ? (
                  <OutlinedButton
                    color={theme.colors['green-500']}
                    onClick={openPixModal}
                    loading={buttonLoading}
                    disabled={buttonLoading}
                  >
                    <IoCheckmarkOutline style={{ fontSize: 20 }} />
                    <span>Confirmar</span>
                  </OutlinedButton>
                ) : (
                  <OutlinedButton
                    color={theme.colors['green-500']}
                    onClick={() => {
                      generatePaymentOrder()
                      setTotal(0)
                    }}
                    loading={buttonLoading}
                    disabled={buttonLoading}
                  >
                    <IoCheckmarkOutline style={{ fontSize: 20 }} />
                    <span>Confirmar</span>
                  </OutlinedButton>
                )}
              </S.ModalFooter>
            </S.ModalContent>
          </DefaultModal>

          <DefaultModal
            title="QR Code"
            visible={modalPixVisible}
            onClose={closeModalPix}
          >
            <S.ModalContent>
              <S.PaymentInfoWrapper>
                <S.PaymentInfoDescription>
                  <Heading fontSize="2xl">
                    Valor a ser pago: {currencyFormat(total)}
                  </Heading>
                  <Text mt={2} color="gray.600" fontSize="sm">
                    Leia o QR Code abaixo para fazer o pagamento,
                    <br /> ou copie a chave Pix.
                  </Text>
                </S.PaymentInfoDescription>
                <PixQRCode
                  pixParams={{
                    chave: '+5538998330021',
                    recebedor: 'Takeback',
                    cidade: 'Porteirinha',
                    identificador: '00001',
                    valor: total,
                    mensagem: 'Pagamento de cashbacks'
                  }}
                  renderAs="svg"
                  includeMargin={true}
                  size={256}
                />
                <S.PixKey onClick={() => copyText(pixKey)}>
                  Chave Pix: {pixKey} <IoCopy />{' '}
                </S.PixKey>
              </S.PaymentInfoWrapper>
              <S.ModalFooter>
                <OutlinedButton
                  color={theme.colors['blue-600']}
                  onClick={closeModalPix}
                  loading={buttonLoading}
                  disabled={buttonLoading}
                >
                  <span>Concluir</span>
                </OutlinedButton>
              </S.ModalFooter>
            </S.ModalContent>
          </DefaultModal>
        </>
      )}
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}
