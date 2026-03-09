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
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'

import Layout from '../../../components/ui/Layout'
import PageLoader from '../../../components/loaders/primaryLoader'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { currencyFormat } from '../../../utils/currencytFormat'
import { chakraToastConfig } from '../../../styles/chakraToastConfig'
import moment from 'moment'

interface RaffleDetails {
  id: string
  title: string
  imageUrl: string
  ticketValue: string
  drawDate: string
  isOpenToOtherCompanies: boolean
  pickUpLocation: string
  companyId: string
  statusId: number
  createdAt: string
  updatedAt: string
  status: {
    id: number
    description: string
  }
  company: {
    fantasyName: string
  }
  items: {
    id: string
    order: number
    description: string
    imageUrl: string
    raffleId: string
    winnerTicketId?: string
    winnerTicket?: {
      consumer: {
        fullName: string
        cpf: string
      }
    }
    raffleItemDelivery?: {
      deliveredAt?: string
      companyUser: {
        name: string
      }
    }
  }[]
  consumers: {
    id: string
    fullName: string
    cpf: string
    _count: {
      raffleTickets: number
    }
  }[]
}

export function RaffleDetail() {
  const { id } = useParams()

  const navigateTo = useNavigate()

  const toast = useToast(chakraToastConfig)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: raffle, isLoading } = useSWR<RaffleDetails>(
    `representative/raffles/${id}`
  )

  if (isLoading || !raffle) {
    return (
      <Layout title="Saque">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PageLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Detalhes do sorteio" goBack={() => navigateTo(-1)}>
      <Stack overflowX="scroll" h="full" p={4}>
        <Card>
          <CardHeader>
            <Heading fontSize="md">Detalhes</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="Título"
                size="sm"
                isReadOnly
                value={raffle.title}
              />
              <ChakraInput
                label="Empresa"
                size="sm"
                isReadOnly
                value={raffle.company.fantasyName}
              />
              <ChakraInput
                label="Status"
                size="sm"
                isReadOnly
                value={raffle.status.description}
              />

              <ChakraInput
                label="Valor de cada Cupom"
                size="sm"
                isReadOnly
                value={currencyFormat(+raffle.ticketValue)}
              />
              <ChakraInput
                label="Data do sorteio"
                size="sm"
                isReadOnly
                value={new Date(raffle.drawDate).toLocaleString()}
              />

              <ChakraInput
                label="Aberto para outras empresas"
                size="sm"
                isReadOnly
                value={raffle.isOpenToOtherCompanies ? 'Sim' : 'Não'}
              />

              <ChakraInput
                label="Local de Retirada"
                size="sm"
                isReadOnly
                value={raffle.pickUpLocation || '-'}
              />

              <Flex align="flex-end" justify="stretch">
                <Button flex={1} colorScheme="blue" size="sm" onClick={onOpen}>
                  Visualizar imagem (Banner)
                </Button>
              </Flex>
            </SimpleGrid>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <Heading fontSize="md">Prêmios</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody as={Stack} overflowX="auto" maxH="48">
            {raffle.items.map(
              ({
                id,
                description,
                winnerTicket,
                imageUrl,
                raffleItemDelivery
              }) => (
                <Flex gap={4} align="center" key={id}>
                  <Image
                    borderRadius="lg"
                    w={12}
                    h={12}
                    mb={0}
                    objectFit="cover"
                    src={imageUrl}
                  />
                  <Flex flexDir="column">
                    <Text fontWeight="bold">{description}</Text>
                    <Text fontSize="sm" fontWeight="medium">
                      Ganhador:{' '}
                      {winnerTicket
                        ? `${winnerTicket.consumer.fullName} - ${winnerTicket.consumer.cpf}`
                        : '-'}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      Entregue em:{' '}
                      {raffleItemDelivery?.deliveredAt
                        ? moment(raffleItemDelivery?.deliveredAt).format(
                            'DD/MM/YYYY HH:mm'
                          ) + ` por ${raffleItemDelivery.companyUser.name}`
                        : '-'}
                    </Text>
                  </Flex>
                </Flex>
              )
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading fontSize="md">Cupons</Heading>
            <Heading fontSize="md">
              Total:{' '}
              {raffle.consumers.reduce(
                (a, b) => a + b._count.raffleTickets,
                0
              ) ?? 0}
            </Heading>
          </CardHeader>
        </Card>
      </Stack>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={4}>
            <Image m={0} w="full" src={raffle.imageUrl} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  )
}
