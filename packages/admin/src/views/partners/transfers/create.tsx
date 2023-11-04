import React, { useEffect, useState } from 'react'

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
  useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router'

import { useForm } from 'react-hook-form'
import { IoCheckmarkSharp } from 'react-icons/io5'
import { maskCurrency, unMaskCurrency } from '../../../utils/masks'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Layout from '../../../components/ui/Layout/Layout'
import useSWR from 'swr'
import { chakraToastConfig } from '../../../styles/chakraToastConfig'
import { ChakraSelect } from '../../../components/chakra/ChakraSelect'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { createTransfer, getCompanyBalance } from './services/api'
import { currencyFormat } from '../../../utils/currencytFormat'
import { DefaultModalChakra } from '../../../components/modals/DefaultModal/DefaultModalChakra'
import * as S from './styles'
import QuartenaryButton from '../../../components/buttons/QuartenaryButton'
import PALLET from '../../../styles/ColorPallet'

const schema = z.object({
  companySentId: z.string(),
  companyReceivedId: z.string(),
  value: z.string()
})

interface ICompanies {
  id: string
  fantasyName: string
}
interface ITransferData {
  companySentId: string
  companyReceivedId: string
  value: number
}

type CreateStoreProductForm = z.infer<typeof schema>

export function CreateCompanyTransfers() {
  const [isCompanySentIdFilled, setIsCompanySentIdFilled] = useState(false)
  const [companyBalance, setCompanyBalance] = useState('')
  const [companiesReceive, setCompaniesReceive] = useState<ICompanies[]>([])
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false)
  const [transferData, setTransferData] = useState<ITransferData>({
    companySentId: '',
    companyReceivedId: '',
    value: 0
  })
  const [loading, setLoading] = useState(false)
  const navigateTo = useNavigate()

  const { data: companies } = useSWR<ICompanies[]>(
    `manager/company/transfer/companies`
  )

  const toast = useToast(chakraToastConfig)

  const { register, handleSubmit, formState, watch } =
    useForm<CreateStoreProductForm>({
      resolver: zodResolver(schema)
    })

  const companySentId = watch('companySentId')
  useEffect(() => {
    const companiesReceiveSelect = companies?.filter(
      company => company.id !== companySentId
    )
    setCompaniesReceive(companiesReceiveSelect || [])
    setIsCompanySentIdFilled(!!companySentId)

    async function handleCompanyBalance(companyId: string) {
      const [isOk, response] = await getCompanyBalance(companyId)

      if (!isOk) {
        return toast({
          title: 'Atenção',
          description: 'Não foi possível buscar o saldo da empresa',
          status: 'error'
        })
      }
      setCompanyBalance(response.positiveBalance || '')
    }
    if (companySentId) {
      handleCompanyBalance(companySentId)
    }
  }, [companySentId, companies, setIsCompanySentIdFilled, toast])

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
      companySentId: data.companySentId,
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
                Saldo disponível: {currencyFormat(Number(companyBalance))}
              </Heading>
            )}
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 3]} gap={8}>
              <ChakraSelect
                label="Empresa a enviar"
                size="sm"
                isRequired
                placeholderOption="Nenhuma empresa selecionado"
                options={
                  companies?.map(c => ({
                    text: c.fantasyName,
                    value: c.id
                  })) || []
                }
                error={formState.errors.companySentId?.message}
                {...register('companySentId')}
              />
              <ChakraSelect
                label="Empresa a receber"
                size="sm"
                isRequired
                placeholderOption="Nenhuma empresa selecionado"
                options={
                  companiesReceive?.map(c => ({
                    text: c.fantasyName,
                    value: c.id
                  })) || []
                }
                isDisabled={!isCompanySentIdFilled}
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
              onClick={handleCreate}
            />
          </S.FooterModal>
        </S.ContainerModal>
      </DefaultModalChakra>
    </Layout>
  )
}
