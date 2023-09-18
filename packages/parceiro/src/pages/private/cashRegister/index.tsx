import React, { useMemo, useState } from 'react'

import useSWR from 'swr'

import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogHeader,
  AlertDialogBody,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Divider,
  Flex,
  FormLabel,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isCPF, formatToBRL } from 'brazilian-values'

import { Layout } from '../../../components/ui/layout'
import { useCashRegisterState } from './state'
import {
  maskCurrency,
  maskPhone,
  unMaskCpf,
  unMaskCurrency
} from '../../../utils/masks'
import { ChakraInput } from './components/ChakraInput'
import { AutocompleteInputCpf } from './components/AutocompleteInputCpf'
import { useForm, useWatch } from 'react-hook-form'
import { API } from '../../../services/API'
import { AxiosError } from 'axios'
import {
  CashierValueStatus,
  cashRegisterStatusColor,
  cashRegisterStatusText,
  getStatus
} from './utils/CashierValueStatus'
import { hasMethodByDescription, sumMethods } from './utils'
import { chakraToastOptions } from '../../../components/ui/toast'
import { ConfirmationModal } from './components/ConfirmationModal'
import { BlockModal } from './components/BlockModal'

const NEW_CLIENT_NAME = 'Novo Cliente'

const schema = z.object({
  cpf: z.string().nonempty({ message: 'Campo não pode estar em branco' }),
  value: z.string().nonempty({ message: 'Campo não pode estar em branco' }),
  paymentMethods: z
    .object(
      {
        id: z.number().positive().int(),
        value: z.string(),
        description: z.string()
      },
      {
        required_error: 'É necessário informar no mínimo uma forma de pagamento'
      }
    )
    .array()
})

export type CashRegisterData = z.infer<typeof schema>

interface PaymentsMethodsResponse {
  company: {
    useCashbackAsBack: boolean
    companyStatus: {
      generateCashback: boolean
    }
  }
  methods: { id: number; description: string }[]
}

interface BirthdaysResponse {
  id: string
  fullName: string
  phone: string
}

interface PaymentMethodFormatted {
  id: number
  value: number
  description: string
}

export function CashRegister() {
  const { consumerName, setConsumerName, setFormData } = useCashRegisterState()

  const blockModal = useDisclosure()

  const alertModal = useDisclosure()

  const toast = useToast(chakraToastOptions)

  const [isLoading, setIsLoading] = useState(false)

  const [birthdayConsumer, setBirthdayConsumer] = useState<BirthdaysResponse>({
    id: '',
    fullName: '',
    phone: ''
  })

  const { data: paymentsMethodsResponse } = useSWR<PaymentsMethodsResponse>(
    'company/payments-methods/find/cashier'
  )

  const { data: birthdaysResponse } = useSWR<BirthdaysResponse[]>(
    'company/cashbacks/find/birthdays'
  )

  const { control, ...form } = useForm<CashRegisterData>({
    resolver: zodResolver(schema),
    defaultValues: {
      cpf: '',
      value: '',
      paymentMethods: []
    }
  })

  const value = useWatch({ control, name: 'value' })
  const paymentMethods = useWatch({ control, name: 'paymentMethods' })

  const [moneyDiff, cashRegisterStatus] = useMemo(() => {
    const paymentSum = sumMethods(paymentMethods)

    return getStatus(
      unMaskCurrency(value),
      paymentSum,
      !!paymentsMethodsResponse?.company.useCashbackAsBack
    )
  }, [paymentMethods, value, paymentsMethodsResponse])

  const cancelRef = React.useRef(null)

  function selectConsumerItem(item: string) {
    const info = item.split(' - ')

    form.setValue('cpf', info[0])

    setConsumerName(info[1])

    form.clearErrors('cpf')
  }

  async function validateCpf() {
    if (consumerName) return

    const cpf = form.getValues('cpf')

    if (!cpf.length) {
      return form.clearErrors('cpf')
    }

    if (cpf.length < 14) {
      form.setFocus('cpf')
      return form.setError('cpf', { message: 'CPF incompleto' })
    }

    if (!isCPF(cpf)) {
      form.setFocus('cpf')

      return form.setError('cpf', { message: 'CPF inválido' })
    }

    form.clearErrors('cpf')

    try {
      const response = await API.get(
        `company/cashback/costumer/${unMaskCpf(cpf)}`
      )

      setConsumerName(response.data?.fullName ?? NEW_CLIENT_NAME)
    } catch (err) {
      const error = err as AxiosError

      form.setFocus('cpf')

      return form.setError('cpf', { message: error.response?.data.message })
    }
  }

  function validateMoneyDiff(
    paymentMethodsFormatted: PaymentMethodFormatted[]
  ) {
    if (!moneyDiff) return

    if (cashRegisterStatus !== CashierValueStatus.CHANGE_IN_CASH) {
      return 'Os valores da compra e pagamento não batem'
    }

    const hasMoneyMethod = hasMethodByDescription(
      paymentMethodsFormatted,
      paymentsMethodsResponse?.methods ?? [],
      'Dinheiro'
    )

    if (!hasMoneyMethod || paymentMethodsFormatted.length > 1) {
      return 'Apenas é possível dar troco como cashback com o método de pagamento Dinheiro e nenhum outro.'
    }
  }

  function handleSubmit({ cpf, paymentMethods, value }: CashRegisterData) {
    const totalAmount = unMaskCurrency(value)

    if (!totalAmount) {
      return toast({
        title: 'Atenção',
        description: 'O valor da compra não pode ser zero',
        status: 'warning'
      })
    }

    const paymentMethodFormatted = paymentMethods
      .map(p => ({
        id: p.id,
        value: unMaskCurrency(p.value),
        description: p.description
      }))
      .filter(p => p.value)

    const errorMessage = validateMoneyDiff(paymentMethodFormatted)

    if (errorMessage) {
      return toast({
        title: 'Atenção',
        description: errorMessage,
        status: 'warning'
      })
    }

    // setRequiresUserCode(
    //   hasMethodByDescription(
    //     paymentMethodFormatted,
    //     paymentsMethodsResponse?.methods ?? [],
    //     'Takeback'
    //   )
    // )

    setFormData({
      backAmount: moneyDiff,
      cpf: unMaskCpf(cpf),
      totalAmount: unMaskCurrency(value),
      paymentMethods: paymentMethodFormatted
    })

    blockModal.onOpen()
  }

  async function handleConsumerBirthday(cpf: string) {
    try {
      const { data } = await API.get(
        `company/cashbacks/consumer/birthday/${cpf}`
      )

      if (data) {
        setBirthdayConsumer(data)
        alertModal.onOpen()
      }
    } catch {
      toast({
        title: 'Houve um erro interno',
        description: 'Procure um administrador',
        status: 'error'
      })
    }
  }

  async function handleConfirmation() {
    form.reset()
  }

  return (
    <Layout title="Lançar cashback manualmente">
      <Flex>
        <Flex flex="1 1 auto">
          <form
            style={{
              width: '100%'
            }}
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <Stack spacing={4} p={4}>
              <Card bg="white">
                <Flex
                  px={4}
                  py={3}
                  gap={2}
                  justify="space-between"
                  align="center"
                >
                  <Heading size="sm">
                    {consumerName ? `Cliente - ${consumerName}` : 'Cliente'}
                  </Heading>
                  {isLoading && <Spinner color="blue.500" size="sm" />}
                </Flex>
                <Divider borderColor="gray.400" />
                <CardBody>
                  <SimpleGrid columns={[1, 2, 3]} gap={8}>
                    <AutocompleteInputCpf
                      selectConsumerItem={selectConsumerItem}
                      control={control}
                      handleConsumerBirthday={handleConsumerBirthday}
                    />
                    <ChakraInput
                      isRequired
                      error={form.formState.errors.value?.message}
                      autoComplete="off"
                      borderColor="gray.500"
                      label="Valor Total (R$)"
                      onFocus={async () => {
                        setIsLoading(true)
                        await validateCpf()
                        setIsLoading(false)
                      }}
                      {...form.register('value', {
                        onChange: e =>
                          form.setValue(
                            'value',
                            maskCurrency(e.currentTarget.value)
                          )
                      })}
                    />
                  </SimpleGrid>
                </CardBody>
              </Card>

              <Card bg="white">
                <Flex px={4} py={3} justify="space-between" align="center">
                  <Heading size="sm">Formas de Pagamento</Heading>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={cashRegisterStatusColor[cashRegisterStatus]}
                  >
                    {cashRegisterStatusText[cashRegisterStatus] +
                      formatToBRL(moneyDiff)}
                  </Text>
                </Flex>
                <Divider borderColor="gray.400" />
                <CardBody>
                  <Stack spacing={4}>
                    <Flex justifyContent="center">
                      <HStack>
                        <Stack minW="40">
                          <FormLabel
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Forma de Pagamento
                          </FormLabel>
                          {paymentsMethodsResponse?.methods.map(
                            (method, index) => (
                              <Box key={method.id}>
                                <Text
                                  fontWeight="bold"
                                  borderBottom="1px solid"
                                  borderColor="gray.500"
                                  h="27px"
                                  fontSize="sm"
                                >
                                  {method.description}
                                </Text>
                                <input
                                  value={method.id}
                                  type="hidden"
                                  {...form.register(
                                    `paymentMethods.${index}.id`,
                                    {
                                      valueAsNumber: true
                                    }
                                  )}
                                />
                                <input
                                  value={method.description}
                                  type="hidden"
                                  {...form.register(
                                    `paymentMethods.${index}.description`
                                  )}
                                />
                              </Box>
                            )
                          )}
                        </Stack>
                        <Stack w="28">
                          <FormLabel
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            Valor (R$)
                          </FormLabel>
                          {paymentsMethodsResponse?.methods.map(
                            (method, index) => (
                              <ChakraInput
                                key={method.id}
                                borderColor="gray.500"
                                {...form.register(
                                  `paymentMethods.${index}.value`,
                                  {
                                    onChange: e =>
                                      form.setValue(
                                        `paymentMethods.${index}.value`,
                                        maskCurrency(e.currentTarget.value)
                                      )
                                  }
                                )}
                              />
                            )
                          )}
                        </Stack>
                      </HStack>
                    </Flex>

                    {form.formState.errors.paymentMethods && (
                      <Text color="red.500" fontWeight="bold" fontSize="sm">
                        {form.formState.errors.paymentMethods.message}
                      </Text>
                    )}

                    <Flex justify="flex-end">
                      <ButtonGroup size="sm">
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            form.reset()
                            setConsumerName('')
                          }}
                        >
                          Resetar
                        </Button>
                        <Button colorScheme="green" type="submit">
                          Finalizar
                        </Button>
                      </ButtonGroup>
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
          </form>
        </Flex>
        {birthdaysResponse && birthdaysResponse.length > 0 && (
          <Flex width="fit-content">
            <Stack p={4} h="100%">
              <aside
                style={{
                  height: '100%',
                  marginBottom: '1.45rem'
                }}
              >
                <Card bg="white" h="100%">
                  <Flex px={4} py={3} gap={2} align="center">
                    <Heading size="sm">Aniversariantes</Heading>
                  </Flex>
                  <Divider borderColor="gray.400" />
                  <CardBody paddingTop={0}>
                    {birthdaysResponse.map(birthday => {
                      const splitedName = birthday.fullName.trim().split(' ')
                      const firstName = splitedName[0]
                      const lastName =
                        splitedName.length > 1
                          ? splitedName[splitedName.length - 1]
                          : undefined
                      return (
                        <Text
                          key={birthday.id}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          {firstName + ' ' + lastName} -{' '}
                          {maskPhone(birthday.phone) || 'Sem telefone'}
                        </Text>
                      )
                    })}
                  </CardBody>
                </Card>
              </aside>
            </Stack>
          </Flex>
        )}
      </Flex>

      <BlockModal
        isOpen={
          paymentsMethodsResponse?.company.companyStatus.generateCashback ===
          false
        }
      />
      <ConfirmationModal
        isOpen={blockModal.isOpen}
        onClose={blockModal.onClose}
        handleConfirmation={handleConfirmation}
      />
      <AlertDialog
        closeOnOverlayClick={false}
        leastDestructiveRef={cancelRef}
        onClose={alertModal.onClose}
        isOpen={alertModal.isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent paddingBottom="1rem">
          <AlertDialogHeader>Aniversariante do dia!</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Hoje é aniversário do {birthdayConsumer.fullName}!
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  )
}
