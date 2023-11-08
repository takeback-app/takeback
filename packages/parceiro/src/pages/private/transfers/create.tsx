import React, { useState } from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  SimpleGrid,
  Stack,
  UseToastOptions,
  useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router'

import { useForm } from 'react-hook-form'
import { IoCheckmarkSharp } from 'react-icons/io5'
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

type CreateStoreProductForm = z.infer<typeof schema>

export function CreateTransfer() {
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false)
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

  async function handleCreate() {
    setLoading(true)
    const [isOk, response] = await createTransfer(transferData)

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
        <S.ContainerModal>
          <S.ContentConfimModal>
            <S.Title>Confirma a tranferência entre as empresas?</S.Title>
          </S.ContentConfimModal>
          <S.FooterModal>
            <QuartenaryButton
              label="Cancelar"
              color="#ff0000"
              type="button"
              onClick={() => setModalConfirmVisible(false)}
            />
            <QuartenaryButton
              label="Confirmar"
              color="#0984E3"
              type="button"
              loading={loading}
              onClick={handleCreate}
            />
          </S.FooterModal>
        </S.ContainerModal>
      </DefaultModalChakra>
    </Layout>
  )
}
