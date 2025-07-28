import React from 'react'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { IoAdd, IoTrash } from 'react-icons/io5'
import { AddItemModal, RaffleCreateItemData } from './AddItemModal'
import { maskCPF, maskPhone } from '../../../../utils/masks'
import moment from 'moment'

export interface Item {
  image?: File
  imageUrl?: string
  winnerTicket?: {
    consumer: {
      fullName: string
      cpf: string
      phone: string
    }
    transaction: {
      company: {
        fantasyName: string
      }
      createdAt: string
      totalAmount: string
    }
  }
  description: string
  order: number
}

interface ItemsCardProps {
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
}

export function EditItemsCard({ items, setItems }: ItemsCardProps) {
  const { isOpen, onClose, onOpen } = useDisclosure()

  function deleteItem(order: number) {
    setItems(state => state.filter(i => i.order !== order))
  }

  function onSubmitNewItem({ description, file }: RaffleCreateItemData) {
    setItems(state => [
      ...state,
      { description, image: file[0], order: state.length + 1 }
    ])

    onClose()
  }

  return (
    <>
      <Card>
        <CardHeader
          as={Flex}
          alignItems="center"
          justifyContent="space-between"
          flexDirection="row"
        >
          <Heading fontSize="md">Prêmios</Heading>
          <Button
            colorScheme="green"
            variant="ghost"
            aria-label="add-item"
            size="sm"
            rounded="full"
            leftIcon={<IoAdd size={20} />}
            onClick={onOpen}
          >
            Inserir Prêmio
          </Button>
        </CardHeader>
        <Divider borderColor="gray.300" />
        <CardBody as={Stack} overflowX="auto" maxH="sm">
          {items.map(
            ({ order, description, image, imageUrl, winnerTicket }) => (
              <Flex justifyContent="space-between" align="center" key={order}>
                {imageUrl || image ? (
                  <Flex gap={4} align="center">
                    <Image
                      borderRadius="lg"
                      w={12}
                      h={12}
                      mb={0}
                      objectFit="cover"
                      src={
                        imageUrl || (image ? URL.createObjectURL(image) : '')
                      }
                    />
                    <Flex flexDir="column">
                      <Text fontWeight="bold">{description}</Text>
                      <Text fontSize="sm" fontWeight="medium">
                        Ganhador:{' '}
                        {winnerTicket
                          ? `${winnerTicket.consumer.fullName} - ${maskCPF(
                              winnerTicket.consumer.cpf
                            )} - ${
                              maskPhone(winnerTicket.consumer.phone) ||
                              'Sem telefone'
                            }`
                          : '-'}
                      </Text>
                      {winnerTicket?.transaction && (
                        <Text fontSize="sm" fontWeight="medium">
                          Local da compra:{' '}
                          {winnerTicket?.transaction.company
                            ? `${
                                winnerTicket?.transaction.company.fantasyName
                              } - ${moment(
                                winnerTicket?.transaction.createdAt
                              ).format('DD/MM/YYYY')} - ${Intl.NumberFormat(
                                'pt-BR',
                                {
                                  style: 'currency',
                                  currency: 'BRL'
                                }
                              ).format(
                                Number(
                                  winnerTicket.transaction.totalAmount || 0
                                )
                              )}`
                            : '-'}
                        </Text>
                      )}
                    </Flex>
                  </Flex>
                ) : null}
                <IconButton
                  aria-label="delete"
                  icon={<IoTrash />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  rounded="full"
                  onClick={() => deleteItem(order)}
                />
              </Flex>
            )
          )}
        </CardBody>
      </Card>

      <AddItemModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmitNewItem={onSubmitNewItem}
      />
    </>
  )
}
