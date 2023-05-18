import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { FormHandles, Scope } from '@unform/core'
import { Form } from '@unform/web'
import Lottie from 'react-lottie'
import { useTheme } from 'styled-components'
import * as Yup from 'yup'

import { API } from '../../../services/API'
import { PaymentMethodsTypes } from '../../../types/PaymentMethods'
import { AuthContext } from '../../../contexts/AuthContext'
import { maskCPF, maskCurrency, unMaskCurrency } from '../../../utils/masks'

import { Layout } from '../../../components/ui/layout'
import { PrimaryInput } from '../../../components/inputs/primaryInput'
import { SelectInput } from '../../../components/inputs/selectInput'
import { OutlinedButton } from '../../../components/buttons'
import { PasswordInput } from '../../../components/inputs/passwordInput'
import { DefaultModal } from '../../../components/modals/defaultModal'
import { FieldMoney } from '../../../components/inputs/fieldMoney'

import CheckAnimation from '../../../assets/check.json'
import LoadAnimation from '../../../assets/load.json'

import * as S from './styles'
import { currencyFormat } from '../../../utils/currencyFormat'
import { AutocompleteInput } from '../../../components/inputs/autocompleteInput'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

interface Payments {
  id: number
  path: string
  value: string
}

interface Methods {
  method: string
  value: string
}

interface DataProps {
  costumer: {
    cpf: string
    value: string
  }
  method: Array<Methods>
}

interface ModalProps {
  visible: boolean
  children: ReactNode
}

let paymentMethodosAdded: Array<Payments> = []

const ModalComponent: React.FC<ModalProps> = ({ children, visible }) => {
  const modalRef = useRef(null)

  return (
    <S.ModalWrapper
      ref={modalRef}
      isOpen={visible}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.40)',
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      <S.ModalContent>{children}</S.ModalContent>
    </S.ModalWrapper>
  )
}

let requireTheKey = false
export const MakeCashback: React.FC = () => {
  const clientFormRef = useRef<FormHandles>(null)
  const formRef = useRef<FormHandles>(null)
  const formPasswordRef = useRef<FormHandles>(null)
  const theme = useTheme()

  const toast = useToast(chakraToastOptions)

  const { setIsSignedIn, setGenerateCashback, generateCashback } =
    useContext(AuthContext)

  const [cashbackData, setCashbackData] = useState<DataProps>()
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [backValue, setBackValue] = useState('')
  const [numberOfMethod, setNumberOfMethod] = useState(0)
  const [modalCodeVisible, setModalCodeVisible] = useState(false)
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false)
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false)
  const [modalConfirmBackVisible, setModalConfirmBackVisible] = useState(false)
  const [modalSuccesVisible, setModalSuccesVisible] = useState(false)
  const [finish, setFinish] = useState(false)
  const [aux, setAux] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<[PaymentMethodsTypes]>()
  const [cpf, setCpf] = useState('')
  const [totalValue, setTotalValue] = useState('')
  const [consumerName, setConsumerName] = useState('')
  const [loadingGetClient, setLoadingGetClient] = useState(false)
  const [loadPassword, setLoadPassword] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [remainingAmountValue, setRemainingAmountValue] = useState('')
  const [color, setColor] = useState('')
  const [useCashbackAsBack, setUseCashbackAsBack] = useState(false)
  const [cpfOptions, setCpfOptions] = useState<string[]>([])
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  const defaultOptions2 = {
    loop: false,
    autoplay: true,
    animationData: CheckAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  // Adiciona um novo método de pagamento
  const addPaymentMethod = () => {
    paymentMethodosAdded.push({
      id: numberOfMethod + 1,
      path: `method[${numberOfMethod}]`,
      value: ''
    })

    setNumberOfMethod(numberOfMethod + 1)
  }

  // Remove um método de pagamento
  const removePaymentMethod = (index: number) => {
    paymentMethodosAdded.splice(index, 1)
    setNumberOfMethod(numberOfMethod + 1)

    let sum = 0
    let sub = 0

    // eslint-disable-next-line array-callback-return
    paymentMethodosAdded.map(item => {
      sum = sum + parseFloat(item.value === '' ? '0' : item.value)
    })

    sub = unMaskCurrency(totalValue) - sum

    JSON.stringify(sub)

    setRemainingAmountValue(sub.toFixed(2))
  }

  // Reseta o formulário
  const resetForm = () => {
    setFinish(false)
    setCode('')
    setCpf('')
    setConsumerName('')
    setTotalValue('')
    setRemainingAmountValue('')
    formRef.current?.reset()
    clientFormRef.current?.reset()
    paymentMethodosAdded = []
    setAux(!aux)
  }

  // Valida os dados inseridos no formulário
  async function validateData(data: DataProps) {
    requireTheKey = false
    let valueTotal = 0
    let valueTotalFixed = 0
    setCode('')

    try {
      const schema = Yup.object().shape({
        costumer: Yup.object().shape({
          cpf: Yup.string().min(14).required('Informe o CPF'),
          value: Yup.string().required('Informe o valor')
        }),
        method: Yup.array().of(
          Yup.object().shape({
            method: Yup.string().required('Informe o metodo'),
            value: Yup.string().required('Informe o valor')
          })
        )
      })

      await schema.validate(data, {
        abortEarly: false
      })

      // Verifica se o método de pagamento Takeback está incluso no métodos informados
      data.method.map(item => {
        valueTotal = valueTotal + unMaskCurrency(item.value)

        const takebackIncluded = paymentMethods?.find(
          meth => meth.id === parseInt(item.method)
        )

        if (takebackIncluded?.paymentMethodId === 1) {
          return (requireTheKey = true)
        }

        return false
      })

      valueTotalFixed = parseFloat(valueTotal.toFixed(2))
      // Verifica se o valor informado é zero ou negativo
      if (valueTotalFixed <= 0 || unMaskCurrency(data.costumer.value) <= 0) {
        return toast({
          title: 'Atenção!',
          description: 'O valor não pode ser ZERO ou NEGATIVO',
          status: 'warning'
        })
      }

      // Verifica se a soma dos métodos de pagamento são iguais ao valor total informado
      if (
        valueTotalFixed !== unMaskCurrency(data.costumer.value) &&
        !useCashbackAsBack
      ) {
        return toast({
          title: 'Atenção!',
          description: 'A soma dos ítens difere do valor total',
          status: 'warning'
        })
      }

      // Remove os ítens nullos do array de métodos de pagamento
      const dataWithoutNullItems = data.method.filter(item => item !== null)

      // Verifica se há métodos de pagamento duplicados
      const uniqueValue = dataWithoutNullItems.filter(
        (elem, index, self) =>
          index === self.findIndex(item => item.method === elem.method)
      )

      if (uniqueValue.length !== dataWithoutNullItems.length) {
        return toast({
          title: 'Atenção!',
          description: 'Há formas de pagamento duplicadas',
          status: 'warning'
        })
      }

      setCashbackData({
        costumer: {
          cpf: data.costumer.cpf.replace(/[^\d]/g, ''),
          value: JSON.stringify(unMaskCurrency(data.costumer.value))
        },
        method: dataWithoutNullItems
      })

      setModalPasswordVisible(true)

      formRef.current?.setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line
        const validationErrors: any = {}

        error.inner.forEach(err => {
          validationErrors[err.path] = err.message
        })

        formRef.current?.setErrors(validationErrors)
        clientFormRef.current?.setErrors(validationErrors)
      }
    }
  }

  // Valida a senha do usuário que está emitindo passando a compra
  const validateUserPassword = () => {
    if (password.length < 3) {
      return toast({
        title: 'Atenção!',
        description: 'Informe sua senha',
        status: 'warning'
      })
    }

    setLoadPassword(true)
    API.post('/company/cashback/confirm-password', {
      password
    })
      .then(() => {
        setModalPasswordVisible(false)

        if (requireTheKey) {
          setModalCodeVisible(true)
        } else {
          verifyIfHasBackValue()
        }
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
        setLoadPassword(false)
      })
  }

  function verifyIfHasBackValue() {
    if (parseFloat(remainingAmountValue) < 0 && useCashbackAsBack) {
      return setModalConfirmBackVisible(true)
    }

    return handleConfirmationModal()
  }

  function handleCashbackAsBackValue() {
    const value = parseFloat(remainingAmountValue) * -1

    setModalConfirmBackVisible(false)
    setBackValue(value.toFixed(2))
    handleConfirmationModal()
  }

  function notHandleCashbackAsBackValue() {
    setModalConfirmBackVisible(false)
    setBackValue('')

    return toast({
      title: 'Atenção!',
      description: 'A soma dos ítens difere do valor total',
      status: 'warning'
    })
  }

  // Busca o nome do usuário para exibir em tela
  const getConsumerInfo = (currentCpf: string = cpf) => {
    setLoadingGetClient(true)
    API.get(`/company/cashback/costumer/${currentCpf.replace(/[^\d]/g, '')}`)
      .then(response => {
        setConsumerName(response.data.fullName)
      })
      .catch(error => {
        clientFormRef.current?.getFieldRef('costumer.cpf').focus()
        setConsumerName('')

        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'info'
        })
      })
      .finally(() => {
        setLoadingGetClient(false)
      })
  }

  const handleConfirmationModal = () => {
    if (consumerName.length) {
      setModalConfirmVisible(true)
    }
  }

  // Verifica se o código informado é válido (caso haja o método de pagamento Takeback)
  const verifyCodeToSendAPI = () => {
    if (code.length < 1) {
      return toast({
        title: 'Atenção!',
        description: 'Informe a chave da compra',
        status: 'warning'
      })
    }

    setModalCodeVisible(false)
    verifyIfHasBackValue()
  }

  const sendCashbackToAPI = () => {
    setModalConfirmVisible(false)
    setModalSuccesVisible(true)

    cashbackData?.method.map(item => {
      return (item.value = String(unMaskCurrency(item.value)))
    })

    API.post('/company/cashback/generate', {
      cashbackData,
      userPassword: password,
      code,
      backValue
    })
      .then(() => {
        setCode('')
        setPassword('')
        setBackValue('')
        setFinish(true)

        formRef.current?.reset()
      })
      .catch(error => {
        setModalSuccesVisible(false)
        setBackValue('')
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
  }

  const closeSuccesModal = () => {
    setModalSuccesVisible(false)
    resetForm()
  }

  function calculateRemainingValue(value: string, id: number) {
    let sum = 0
    let sub = 0

    value = String(unMaskCurrency(value))

    paymentMethodosAdded.map((item, index) => {
      if (index === id) {
        paymentMethodosAdded[index].value = value
      }

      return value
    })

    // eslint-disable-next-line array-callback-return
    paymentMethodosAdded.map(item => {
      sum = sum + parseFloat(item.value === '' ? '0' : item.value)
    })

    sub = unMaskCurrency(totalValue) - sum

    JSON.stringify(sub)

    if (sub < 0) {
      setColor(theme.colors['red-400'])
    }
    if (sub === 0) {
      setColor(theme.colors['blue-500'])
    }
    if (sub > 0) {
      setColor(theme.colors['gray-900'])
    }

    setRemainingAmountValue(sub.toFixed(2))
  }

  const handleAutocompleteOptions = (currentCpf: string = cpf) => {
    const cpfFragment = currentCpf.replace(/[^\d]/g, '')
    if (cpfFragment.length > 3) {
      API.get(`/company/cashback/costumer/autocomplete/${cpfFragment}`).then(
        ({ data }) => {
          setCpfOptions(data)
        }
      )
    }
  }

  const handleSelectFromCpfOptions = (e: React.FormEvent<HTMLDivElement>) => {
    setCpf(maskCPF(e.currentTarget.textContent?.slice(0, 14) ?? ''))
    setCpfOptions([])
    setIsAutocompleteOpen(false)
    clientFormRef.current?.getFieldRef('costumer.cpf').focus()
  }

  const handlePurchaseAmount = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      clientFormRef.current?.getFieldRef('costumer.value').focus()
    }
  }

  const handlePaymentMethods = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && !numberOfMethod && addPaymentMethod()
  }

  useEffect(() => {
    modalPasswordVisible &&
      formPasswordRef.current?.getFieldRef('password').focus()
  }, [modalPasswordVisible])

  useEffect(() => {
    setIsAutocompleteOpen(!!cpfOptions.length)
  }, [cpfOptions])

  // Busca os métodos de pagamentos utilizados pela empresa e verifica se a empresa está liberada para emitir cashback
  useEffect(() => {
    API.get('/company/payments-methods/find/cashier')
      .then(response => {
        setPaymentMethods(response.data.methods)
        setUseCashbackAsBack(response.data.company.useCashbackAsBack)
        setGenerateCashback(response.data.company.status.generateCashback)
      })
      .catch(error => {
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })

        if (error.response.status === 498) {
          setIsSignedIn(false)
        }
      })

    paymentMethodosAdded = []
    // eslint-disable-next-line
  }, [setIsSignedIn])

  return (
    <Layout title="Caixa">
      <S.Container>
        <Form ref={clientFormRef} onSubmit={validateData}>
          <S.Card>
            <S.CardHeader>
              <S.CardTitle>Cliente</S.CardTitle>
              <S.CardSubTitle>{consumerName}</S.CardSubTitle>
            </S.CardHeader>

            <S.CardMain style={{ padding: '1rem' }}>
              <Scope path="costumer">
                <AutocompleteInput
                  label="CPF"
                  name="cpf"
                  value={cpf}
                  autoFocus={true}
                  onChange={e => {
                    setCpf(maskCPF(e.currentTarget.value.slice(0, 14)))
                    setConsumerName('')
                    handleAutocompleteOptions(
                      e.currentTarget.value.slice(0, 14)
                    )
                  }}
                  onBlur={e => {
                    const time = setTimeout(() => {
                      getConsumerInfo(
                        (e.target as HTMLInputElement).value.slice(0, 14)
                      )
                      setIsAutocompleteOpen(false)
                      clearTimeout(time)
                    }, 100)
                  }}
                  onKeyUp={handlePurchaseAmount}
                  maxLength={14}
                  type="string"
                  options={cpfOptions}
                  isOpen={isAutocompleteOpen}
                  handleSelectOption={handleSelectFromCpfOptions}
                />
                <PrimaryInput
                  label="Valor da Compra"
                  name="value"
                  value={totalValue}
                  onChange={e =>
                    setTotalValue(maskCurrency(e.currentTarget.value))
                  }
                  onKeyUp={handlePaymentMethods}
                  type="string"
                />
              </Scope>
            </S.CardMain>
            <S.TitleMobileWrapper>
              {remainingAmountValue.length > 0 && (
                <S.CardTitleToMobile color={color}>
                  {parseFloat(remainingAmountValue) < 0
                    ? useCashbackAsBack
                      ? 'Troco'
                      : 'Valor excedente'
                    : 'Valor restante'}
                  : {currencyFormat(parseFloat(remainingAmountValue) * -1)}
                </S.CardTitleToMobile>
              )}
            </S.TitleMobileWrapper>
          </S.Card>

          <S.Card>
            <S.CardHeader>
              <S.CardTitle>Formas de Pagamento</S.CardTitle>
              {remainingAmountValue.length > 0 && (
                <S.CardTitleToWeb color={color}>
                  {parseFloat(remainingAmountValue) < 0
                    ? useCashbackAsBack
                      ? 'Troco'
                      : 'Valor excedente'
                    : 'Valor restante'}
                  : {currencyFormat(parseFloat(remainingAmountValue) * -1)}
                </S.CardTitleToWeb>
              )}
            </S.CardHeader>

            {paymentMethodosAdded.map((method, index) => (
              <S.CardMain key={method.id}>
                <Scope path={method.path}>
                  <SelectInput
                    label="Forma de Pagamento"
                    name="method"
                    options={paymentMethods}
                  />
                  <FieldMoney
                    label="Valor"
                    name="value"
                    type="string"
                    autoFocus={true}
                    withCurrencySymbol={false}
                    width={100}
                    onChange={e => {
                      e.currentTarget.value = maskCurrency(
                        e.currentTarget.value
                      )

                      calculateRemainingValue(
                        e.currentTarget.value.replace(',', '.'),
                        index
                      )
                    }}
                  />
                  {paymentMethodosAdded.length > 1 && (
                    <S.RemoveButton
                      onClick={() => removePaymentMethod(index)}
                      type="button"
                    >
                      Remover
                    </S.RemoveButton>
                  )}
                </Scope>
              </S.CardMain>
            ))}

            <S.CardFooter>
              <OutlinedButton
                type="button"
                color="#43A0E7"
                widthMobile="full"
                onClick={addPaymentMethod}
              >
                <span>Adicionar forma de pagamento</span>
              </OutlinedButton>
              <S.ButtonsWrapper>
                <OutlinedButton
                  type="reset"
                  color={theme.colors['red-400']}
                  widthMobile="full"
                  onClick={resetForm}
                >
                  <span>Resetar</span>
                </OutlinedButton>

                <OutlinedButton
                  type="submit"
                  color={theme.colors['green-600']}
                  widthMobile="full"
                  loading={loadingGetClient}
                  disabled={loadingGetClient}
                >
                  <span>Finalizar</span>
                </OutlinedButton>
              </S.ButtonsWrapper>
            </S.CardFooter>
          </S.Card>
        </Form>

        {!generateCashback && (
          <S.Overlay
            style={{
              position: 'absolute',
              zIndex: 98,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.60)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <S.AlertIcon />
            <h4 style={{ textTransform: 'uppercase' }}>
              Sem permissão para realizar vendas!
            </h4>
            <h6
              style={{
                fontWeight: 500,
                textAlign: 'center',
                textTransform: 'uppercase',
                lineHeight: '18px'
              }}
            >
              Realize o pagamento dos cashbacks em atrazo ou <br /> entre em
              contato com a TakeBack para resolver a situação.
            </h6>
          </S.Overlay>
        )}
      </S.Container>

      <DefaultModal
        visible={modalPasswordVisible}
        onClose={() => setModalPasswordVisible(false)}
        title={'Informe sua senha'}
      >
        <Form ref={formPasswordRef} onSubmit={validateUserPassword}>
          <S.ContentModal>
            <S.InputsWrapper>
              <PasswordInput
                label="Digite sua senha"
                name="password"
                value={password}
                onChange={e => setPassword(e.currentTarget.value)}
                toggle={() => setPasswordVisible(!passwordVisible)}
                visible={passwordVisible}
              />
            </S.InputsWrapper>
            <S.Footer>
              <OutlinedButton
                type="submit"
                loading={loadPassword}
                disabled={loadPassword}
                color={theme.colors['blue-500']}
              >
                <span>Confirmar</span>
              </OutlinedButton>
            </S.Footer>
          </S.ContentModal>
        </Form>
      </DefaultModal>

      <DefaultModal
        visible={modalCodeVisible}
        onClose={() => setModalCodeVisible(false)}
        title={'Informe a chave da compra'}
      >
        <Form ref={formRef} onSubmit={verifyCodeToSendAPI}>
          <S.ContentModal>
            <S.InputsWrapper>
              <PrimaryInput
                label="Digite a Chave Aqui"
                name="code"
                onChange={e => setCode(e.currentTarget.value)}
              />
            </S.InputsWrapper>
            <S.Footer>
              <OutlinedButton
                type="button"
                color={theme.colors['blue-500']}
                onClick={verifyCodeToSendAPI}
              >
                <span>Finalizar</span>
              </OutlinedButton>
            </S.Footer>
          </S.ContentModal>
        </Form>
      </DefaultModal>

      <DefaultModal
        visible={modalConfirmVisible}
        onClose={() => setModalConfirmVisible(false)}
        title={`Confirma a compra do cliente ${consumerName}?`}
      >
        <S.Space />
        <S.FooterTwoButton>
          <OutlinedButton
            type="button"
            color={theme.colors['red-400']}
            onClick={() => setModalConfirmVisible(false)}
          >
            <span>Cancelar</span>
          </OutlinedButton>
          <OutlinedButton
            type="button"
            color={theme.colors['blue-500']}
            onClick={sendCashbackToAPI}
          >
            <span>Confirmar</span>
          </OutlinedButton>
        </S.FooterTwoButton>
      </DefaultModal>

      <DefaultModal
        visible={modalConfirmBackVisible}
        onClose={() => setModalConfirmBackVisible(false)}
        title="Entregar troco em forma de cashback?"
      >
        <S.Space />
        <S.FooterTwoButton>
          <OutlinedButton
            type="button"
            color={theme.colors['red-400']}
            onClick={notHandleCashbackAsBackValue}
          >
            <span>Não, corrigir valor</span>
          </OutlinedButton>
          <OutlinedButton
            type="button"
            color={theme.colors['blue-500']}
            onClick={handleCashbackAsBackValue}
          >
            <span>Sim</span>
          </OutlinedButton>
        </S.FooterTwoButton>
      </DefaultModal>

      <ModalComponent visible={modalSuccesVisible}>
        {finish ? (
          <S.OtherMain>
            <Lottie
              options={defaultOptions2}
              height={120}
              width={120}
              isStopped={false}
              isPaused={false}
              isClickToPauseDisabled
            />
            <S.ProcessingText>Cashback Emitido com Sucesso</S.ProcessingText>
            <S.CloseButton onClick={closeSuccesModal}>OK</S.CloseButton>
          </S.OtherMain>
        ) : (
          <S.OtherMain>
            <Lottie
              options={defaultOptions}
              height={120}
              width={120}
              isStopped={false}
              isPaused={false}
              isClickToPauseDisabled
            />
            <S.ProcessingText>Processando Cashback...</S.ProcessingText>
          </S.OtherMain>
        )}
      </ModalComponent>
    </Layout>
  )
}
