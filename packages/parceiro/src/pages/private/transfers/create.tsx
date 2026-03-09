import React, { useState } from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Stack,
  UseToastOptions,
  useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router'

import { useForm } from 'react-hook-form'
import { IoCheckmarkSharp, IoEye, IoEyeOff } from 'react-icons/io5'
import { maskCurrency, unMaskCurrency } from '../../../utils/masks'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useSWR from 'swr'
import { ChakraSelect } from '../../../components/chakra/ChakraSelect'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { createTransfer } from './services/api'
import * as S from './styles'
import { Layout } from '../../../components/ui/layout'
import { currencyFormat } from '../../../utils/currencyFormat'
import { DefaultModalChakra } from './components/DefaultModalChakra'
import QuartenaryButton from './components/QuartenaryButton'

const schema = z.object({
  companyReceivedId: z.string(),
  value: z.string()
})

const passwordSchema = z.object({
  password: z
    .string()
    .nonempty({ message: 'Senha deve ter no mínimo 3 caracteres' })
    .min(3, { message: 'Senha deve ter no mínimo 3 caracteres' })
})

const chakraToastConfig: UseToastOptions = {
  position: 'top-right',
  duration: 5000,
  isClosable: true
}

interface ICompanies {
  id: string
  fantasyName: string
}
interface ITransferData {
  companyReceivedId: string
  value: number
}

interface IPasswordData {
  password: string
}

type CreateStoreProductForm = z.infer<typeof schema>
type PasswordForm = z.infer<typeof passwordSchema>

export function CreateTransfer() {
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false)
  const [show, setShow] = useState(false)
  const [transferData, setTransferData] = useState<ITransferData>({
    companyReceivedId: '',
    value: 0
  })
  const [loading, setLoading] = useState(false)
  const navigateTo = useNavigate()

  const { data: companies } = useSWR<ICompanies[]>(`company/transfer/companies`)
  const { data: companyBalance } = useSWR<{ positiveBalance: string }>(
    `company/balance`
  )

  const toast = useToast(chakraToastConfig)

  const { register, handleSubmit, formState } = useForm<CreateStoreProductForm>(
    {
      resolver: zodResolver(schema)
    }
  )

  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    formState: passwordFormState
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  async function handleCreate(data: PasswordForm) {
    setLoading(true)
    const password = data.password
    const [isOk, response] = await createTransfer({ ...transferData, password })

    if (!isOk) {
      setModalConfirmVisible(false)
      setLoading(false)
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

    setModalConfirmVisible(false)
    setLoading(false)
    navigateTo(-1)
  }

  function handleClick(data: CreateStoreProductForm) {
    setTransferData({
      companyReceivedId: data.companyReceivedId,
      value: unMaskCurrency(data.value)
    })
    setModalConfirmVisible(true)
  }

  return (
    <Layout title="Transferências" goBack={() => navigateTo(-1)}>
      <Stack
        as="form"
        onSubmit={handleSubmit(handleClick)}
        overflowX="scroll"
        h="full"
        p={4}
      >
        <Card>
          <CardHeader>
            {!companyBalance && <Heading fontSize="md">Enviar saldo</Heading>}
            {companyBalance && (
              <Heading fontSize="md">
                Saldo disponível:{' '}
                {currencyFormat(Number(companyBalance.positiveBalance))}
              </Heading>
            )}
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 2, 2]} gap={8}>
              <ChakraSelect
                label="Empresa a receber"
                size="sm"
                isRequired
                placeholderOption="Nenhuma empresa selecionado"
                options={
                  companies?.map(c => ({
                    text: c.fantasyName,
                    value: c.id
                  })) || []
                }
                error={formState.errors.companyReceivedId?.message}
                {...register('companyReceivedId')}
              />

              <ChakraInput
                label="Valor para transferir"
                isRequired
                error={formState.errors.value?.message}
                size="sm"
                {...register('value', {
                  onChange: e => {
                    e.currentTarget.value = maskCurrency(e.currentTarget.value)
                  }
                })}
              />
            </SimpleGrid>
          </CardBody>
        </Card>

        <ButtonGroup justifyContent="flex-end">
          <Button
            colorScheme="green"
            leftIcon={<IoCheckmarkSharp />}
            type="submit"
          >
            Enviar
          </Button>
        </ButtonGroup>
      </Stack>
      <DefaultModalChakra
        title="Confime a operação"
        visible={modalConfirmVisible}
        onClose={() => setModalConfirmVisible(false)}
      >
        <form
          style={{ margin: 0 }}
          onSubmit={passwordHandleSubmit(handleCreate)}
        >
          <S.ContainerModal>
            <S.ContentConfimModal>
              <S.Title>Confirma a tranferência entre as empresas?</S.Title>

              <FormControl isInvalid={!!passwordFormState.errors.password}>
                <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600">
                  Sua senha
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    variant="flushed"
                    fontSize="sm"
                    size="xs"
                    autoComplete="off"
                    type={show ? 'text' : 'password'}
                    autoFocus
                    {...passwordRegister('password')}
                  />
                  <InputRightElement width="2.5rem">
                    <IconButton
                      h="1.75rem"
                      mt={-8}
                      size="sm"
                      aria-label=""
                      icon={show ? <IoEyeOff /> : <IoEye />}
                      onClick={() => setShow(state => !state)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {passwordFormState.errors.password?.message}
                </FormErrorMessage>
              </FormControl>
            </S.ContentConfimModal>

            <S.FooterModal>
              <Button
                isDisabled={loading}
                onClick={() => setModalConfirmVisible(false)}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="green"
                isLoading={loading}
                type="submit"
                ml={3}
              >
                Confirmar
              </Button>
            </S.FooterModal>
          </S.ContainerModal>
        </form>
      </DefaultModalChakra>
    </Layout>
  )
}
