import React from 'react'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'

import Layout from '../../components/ui/Layout'
import PageLoader from '../../components/loaders/primaryLoader'
import { ChakraInput } from '../../components/chakra/ChakraInput'
import { currencyFormat } from '../../utils/currencytFormat'
import { AppTable } from '../../components/tables'

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
  createdAt: string
  company: {
    fantasyName: string
  }
  storeOrders: StoreOrder[]
}

interface StoreOrder {
  id: string
  consumerId: string
  storeProductId: string
  quantity: number
  value: string
  validationCode: string
  withdrawalAt?: string
  createdAt: string
  consumer: Consumer
}

interface Consumer {
  fullName: string
}

export function StoreProductDetail() {
  const { id } = useParams()

  const navigateTo = useNavigate()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: product, isLoading } = useSWR<ProductDetails>(
    `manager/store/products/${id}`
  )

  if (isLoading || !product) {
    return (
      <Layout title="Oferta">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PageLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Detalhes da oferta" goBack={() => navigateTo(-1)}>
      <Stack overflowX="scroll" h="full" p={4}>
        <Card>
          <CardHeader>
            <Heading fontSize="md">Detalhes</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="Nome do produto"
                size="sm"
                isReadOnly
                value={product.name}
              />

              <ChakraInput
                label="Empresa"
                size="sm"
                isReadOnly
                value={product.company.fantasyName}
              />

              <ChakraInput
                label="Unidade"
                size="sm"
                isReadOnly
                value={product.unit}
              />

              <ChakraInput
                label="Preço padrão"
                size="sm"
                isReadOnly
                value={currencyFormat(+product.defaultPrice)}
              />

              <ChakraInput
                label="Preço de Compra"
                size="sm"
                isReadOnly
                value={currencyFormat(+product.buyPrice)}
              />
              <ChakraInput
                label="Preço de Venda"
                size="sm"
                isReadOnly
                value={currencyFormat(+product.sellPrice)}
              />
              <ChakraInput
                label="Estoque atual"
                size="sm"
                isReadOnly
                value={product.stock}
              />

              <ChakraInput
                label="Máximo de produtos por cliente"
                size="sm"
                isReadOnly
                value={product.maxBuyPerConsumer}
              />
              <ChakraInput
                label="Data limite para compra"
                size="sm"
                isReadOnly
                value={new Date(product.dateLimit).toLocaleDateString()}
              />
              <ChakraInput
                label="Data limite para retirada"
                size="sm"
                isReadOnly
                value={new Date(
                  product.dateLimitWithdrawal
                ).toLocaleDateString()}
              />
              <Flex align="flex-end" justify="stretch">
                <Button flex={1} colorScheme="blue" size="sm" onClick={onOpen}>
                  Visualizar imagem
                </Button>
              </Flex>
            </SimpleGrid>
          </CardBody>
        </Card>
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
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={4}>
            <Image m={0} w="full" src={product.imageUrl} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  )
}
