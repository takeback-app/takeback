import React from 'react'

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
import { maskCurrency, unMaskCurrency } from '../../utils/masks'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Layout from '../../components/ui/Layout/Layout'
import { chakraToastConfig } from '../../styles/chakraToastConfig'
import { ChakraInput } from '../../components/chakra/ChakraInput'
import { storeImage, storeProduct } from './services/api'
import { ImagePreview } from '../../components/ImagePreview'
import { ChakraSelect } from '../../components/chakra/ChakraSelect'
import useSWR from 'swr'

const schema = z.object({
  name: z.string(),
  file: z.instanceof(FileList),
  // imageUrl: z.string().url(),
  companyId: z.string(),
  buyPrice: z.string(),
  sellPrice: z.string(),
  defaultPrice: z.string(),
  unit: z.string(),
  stock: z.string(),
  maxBuyPerConsumer: z.string(),
  dateLimit: z.string(),
  dateLimitWithdrawal: z.string()
})

type CreateStoreProductForm = z.infer<typeof schema>

export function CreateStoreProduct() {
  const navigateTo = useNavigate()

  const { data: companies } = useSWR<{ id: string; fantasyName: string }[]>(
    `manager/store/companies`
  )

  const toast = useToast(chakraToastConfig)

  const { register, handleSubmit, formState, watch } =
    useForm<CreateStoreProductForm>({
      resolver: zodResolver(schema)
    })

  const files = watch('file')

  async function handleCreate(data: CreateStoreProductForm) {
    if (!data.file.length) {
      return toast({
        title: 'Atenção',
        description: 'Não é possível criar uma oferta sem a imagem do produto',
        status: 'warning'
      })
    }

    const [isImageOk, imageData] = await storeImage(data.file[0])

    if (!isImageOk) {
      return toast({
        title: 'Atenção',
        description: imageData.message,
        status: 'error'
      })
    }

    const [isOk, response] = await storeProduct({
      name: data.name,
      imageUrl: imageData.url,
      companyId: data.companyId,
      unit: data.unit,
      buyPrice: unMaskCurrency(data.buyPrice),
      sellPrice: unMaskCurrency(data.sellPrice),
      defaultPrice: unMaskCurrency(data.defaultPrice),
      stock: parseInt(data.stock),
      maxBuyPerConsumer: parseInt(data.maxBuyPerConsumer),
      dateLimit: new Date(data.dateLimit).toISOString(),
      dateLimitWithdrawal: new Date(data.dateLimitWithdrawal).toISOString()
    })

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

    navigateTo(-1)
  }

  return (
    <Layout title="Criar Oferta" goBack={() => navigateTo(-1)}>
      <Stack
        as="form"
        onSubmit={handleSubmit(handleCreate)}
        overflowX="scroll"
        h="full"
        p={4}
      >
        <Card>
          <CardHeader>
            <Heading fontSize="md">Dados do Representante</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="Nome do produto"
                size="sm"
                isRequired
                error={formState.errors.name?.message}
                {...register('name')}
              />

              <ChakraInput
                label="Imagem do produto"
                size="sm"
                type="file"
                isRequired
                accept="image/*"
                error={formState.errors.file?.message}
                {...register('file')}
              />

              <ChakraSelect
                label="Empresa"
                size="sm"
                isRequired
                placeholderOption="Nenhuma empresa selecionado"
                options={
                  companies?.map(c => ({
                    text: c.fantasyName,
                    value: c.id
                  })) || []
                }
                error={formState.errors.companyId?.message}
                {...register('companyId')}
              />

              <ChakraInput
                label="Unidade"
                size="sm"
                isRequired
                error={formState.errors.unit?.message}
                {...register('unit')}
              />

              <ChakraInput
                label="Preço padrão"
                isRequired
                error={formState.errors.defaultPrice?.message}
                size="sm"
                {...register('defaultPrice', {
                  onChange: e => {
                    e.currentTarget.value = maskCurrency(e.currentTarget.value)
                  }
                })}
              />

              <ChakraInput
                label="Preço de Compra"
                isRequired
                error={formState.errors.buyPrice?.message}
                size="sm"
                {...register('buyPrice', {
                  onChange: e => {
                    e.currentTarget.value = maskCurrency(e.currentTarget.value)
                  }
                })}
              />
              <ChakraInput
                label="Preço de Venda"
                size="sm"
                error={formState.errors.sellPrice?.message}
                isRequired
                {...register('sellPrice', {
                  onChange: e => {
                    e.currentTarget.value = maskCurrency(e.currentTarget.value)
                  }
                })}
              />
              <ChakraInput
                label="Estoque inicial"
                size="sm"
                isRequired
                error={formState.errors.stock?.message}
                {...register('stock', {
                  onChange: e => {
                    e.currentTarget.value =
                      parseInt(e.currentTarget.value) || ''
                  }
                })}
              />

              <ChakraInput
                label="Máximo de produtos por cliente"
                size="sm"
                isRequired
                error={formState.errors.maxBuyPerConsumer?.message}
                {...register('maxBuyPerConsumer', {
                  onChange: e => {
                    e.currentTarget.value =
                      parseInt(e.currentTarget.value) || ''
                  }
                })}
              />
              <ChakraInput
                label="Data limite para compra"
                size="sm"
                type="date"
                isRequired
                error={formState.errors.dateLimit?.message}
                {...register('dateLimit')}
              />
              <ChakraInput
                label="Data limite para retirada"
                size="sm"
                type="date"
                isRequired
                error={formState.errors.dateLimitWithdrawal?.message}
                {...register('dateLimitWithdrawal')}
              />
            </SimpleGrid>
            {files && files.length ? <ImagePreview file={files[0]} /> : null}
          </CardBody>
        </Card>

        <ButtonGroup justifyContent="flex-end">
          <Button
            colorScheme="green"
            leftIcon={<IoCheckmarkSharp />}
            type="submit"
          >
            Salvar
          </Button>
        </ButtonGroup>
      </Stack>
    </Layout>
  )
}
