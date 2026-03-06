import React, { useEffect } from 'react'

import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react'
import { AppTable } from '../../components/tables'
import { currencyFormat } from '../../utils/currencytFormat'
import { useNavigate, useParams } from 'react-router'

import { useForm } from 'react-hook-form'
import { IoCheckmarkSharp } from 'react-icons/io5'
import { maskCurrency, unMaskCurrency } from '../../utils/masks'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Layout from '../../components/ui/Layout/Layout'
import { chakraToastConfig } from '../../styles/chakraToastConfig'
import { ChakraInput } from '../../components/chakra/ChakraInput'
import { storeImage, updateProduct } from './services/api'
import { ImagePreview } from '../../components/ImagePreview'
import { ChakraSelect } from '../../components/chakra/ChakraSelect'
import useSWR from 'swr'
import PageLoader from '../../components/loaders/primaryLoader'

const schema = z.object({
  name: z.string(),
  file: z.instanceof(FileList).optional(),
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

type EditStoreProductForm = z.infer<typeof schema>

interface ProductDetails {
  id: string
  name: string
  imageUrl: string
  companyId: string
  buyPrice: string
  sellPrice: string
  defaultPrice: string
  stock: number
  maxBuyPerConsumer: number
  dateLimit: string
  dateLimitWithdrawal: string
  unit: string
  storeOrders: StoreOrder[]
}

interface StoreOrder {
  id: string
  quantity: number
  value: string
  withdrawalAt?: string
  createdAt: string
  consumer: { fullName: string }
}

function toDateInput(iso: string): string {
  return new Date(new Date(iso).getTime() - 3 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
}

export function EditStoreProduct() {
  const { id } = useParams()
  const navigateTo = useNavigate()
  const toast = useToast(chakraToastConfig)

  const { data: product, isLoading } = useSWR<ProductDetails>(
    `manager/store/products/${id}`
  )

  const { data: companies } = useSWR<{ id: string; fantasyName: string }[]>(
    `manager/store/companies`
  )

  const { register, handleSubmit, formState, watch, reset } =
    useForm<EditStoreProductForm>({
      resolver: zodResolver(schema)
    })

  useEffect(() => {
    if (!product) return

    reset({
      name: product.name,
      unit: product.unit,
      companyId: product.companyId,
      buyPrice: maskCurrency(Number(product.buyPrice)),
      sellPrice: maskCurrency(Number(product.sellPrice)),
      defaultPrice: maskCurrency(Number(product.defaultPrice)),
      stock: String(product.stock),
      maxBuyPerConsumer: String(product.maxBuyPerConsumer),
      dateLimit: toDateInput(product.dateLimit),
      dateLimitWithdrawal: toDateInput(product.dateLimitWithdrawal)
    })
  }, [product, reset])

  const files = watch('file')
  const hasOrders = !!product && product.storeOrders.length > 0

  async function handleUpdate(data: EditStoreProductForm) {
    if (!id) return

    let imageUrl = product!.imageUrl

    if (data.file && data.file.length > 0) {
      const [isImageOk, imageData] = await storeImage(data.file[0])

      if (!isImageOk) {
        return toast({
          title: 'Atenção',
          description: imageData.message,
          status: 'error'
        })
      }

      imageUrl = imageData.url
    }

    const payload: any = {
      name: data.name,
      imageUrl,
      unit: data.unit,
      defaultPrice: unMaskCurrency(data.defaultPrice),
      maxBuyPerConsumer: parseInt(data.maxBuyPerConsumer),
      dateLimit: new Date(data.dateLimit).toISOString(),
      dateLimitWithdrawal: new Date(data.dateLimitWithdrawal).toISOString()
    }

    payload.stock = parseInt(data.stock)

    if (!hasOrders) {
      payload.sellPrice = unMaskCurrency(data.sellPrice)
      payload.buyPrice = unMaskCurrency(data.buyPrice)
      payload.companyId = data.companyId
    }

    const [isOk, response] = await updateProduct(id, payload)

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

  if (isLoading || !product) {
    return (
      <Layout title="Editar Oferta">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PageLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Editar Oferta" goBack={() => navigateTo(-1)}>
      <Stack
        as="form"
        onSubmit={handleSubmit(handleUpdate)}
        overflowX="scroll"
        h="full"
        p={4}
      >
        {hasOrders && (
          <Alert status="warning">
            <AlertIcon />
            Esta oferta já possui compras. Os campos de empresa, preço de compra
            e preço de venda não podem ser alterados.
          </Alert>
        )}

        <Card>
          <CardHeader>
            <Heading fontSize="md">Dados da Oferta</Heading>
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
                accept="image/*"
                error={formState.errors.file?.message as string}
                {...register('file')}
              />

              <ChakraSelect
                label="Empresa"
                size="sm"
                isRequired
                isDisabled={hasOrders}
                placeholderOption="Nenhuma empresa selecionada"
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
                isRequired={!hasOrders}
                isDisabled={hasOrders}
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
                isRequired={!hasOrders}
                isDisabled={hasOrders}
                error={formState.errors.sellPrice?.message}
                {...register('sellPrice', {
                  onChange: e => {
                    e.currentTarget.value = maskCurrency(e.currentTarget.value)
                  }
                })}
              />

              <ChakraInput
                label="Estoque"
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
            isLoading={formState.isSubmitting}
          >
            Salvar
          </Button>
        </ButtonGroup>

        <Card>
          <CardHeader>
            <Heading fontSize="md">Compras</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody as={Stack}>
            <AppTable
              dataLength={product.storeOrders.length}
              noDataMessage="Nenhuma compra"
              p={0}
            >
              <Thead>
                <Tr>
                  <Th>Cliente</Th>
                  <Th>Qtd</Th>
                  <Th>Unidade</Th>
                  <Th>Valor da compra</Th>
                  <Th isNumeric>Retirada</Th>
                </Tr>
              </Thead>
              <Tbody>
                {product.storeOrders.map(order => (
                  <Tr color="gray.500" key={order.id}>
                    <Td fontSize="xs">{order.consumer.fullName}</Td>
                    <Td fontSize="xs">{order.quantity}</Td>
                    <Td fontSize="xs">{product.unit}</Td>
                    <Td fontSize="xs">{currencyFormat(+order.value)}</Td>
                    <Td fontSize="xs" isNumeric>
                      {order.withdrawalAt
                        ? new Date(order.withdrawalAt).toLocaleString()
                        : '-'}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </AppTable>
          </CardBody>
        </Card>
      </Stack>
    </Layout>
  )
}
