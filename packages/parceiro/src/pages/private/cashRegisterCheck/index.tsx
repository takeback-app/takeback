import React from 'react'

import { FiFilter } from 'react-icons/fi'

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Flex,
  Heading,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  useDisclosure
} from '@chakra-ui/react'

import useSWR from 'swr'

import Loader from 'react-spinners/PulseLoader'
import { Layout } from '../../../components/ui/layout'
import { currencyFormat } from '../../../utils/currencyFormat'
import { FilterDrawer } from './components/FilterDrawer'
import { useCashConference } from './state'
import moment from 'moment'

interface Data {
  totalAmount: number
  users: Array<{
    id: string
    name: string
    paymentMethods: Array<{
      description: string
      value: number
    }>
  }>
}

export function CashRegisterCheck() {
  const { date, type } = useCashConference()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data, isLoading } = useSWR<Data>(
    `company/cash-conference?date=${new Date(date).toISOString()}&type=${type}`
  )

  if (!data || isLoading) {
    return (
      <Layout title="Conferencia de Caixa">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Conferencia de Caixa">
      <Box p={4}>
        <ButtonGroup
          display="flex"
          mb={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontWeight="medium">
            Dia: {moment(date).add(3, 'hours').format('DD/MM/YYYY')}
          </Text>
          <Button leftIcon={<FiFilter />} onClick={onOpen} colorScheme="teal">
            Filtro
          </Button>
        </ButtonGroup>
        <Stack spacing={4}>
          <Card align="center" px={8} py={6}>
            <Stack
              w={{ base: 'full', md: 'sm', lg: '2xl' }}
              divider={<Divider borderBottomWidth={1.5} />}
              spacing={4}
            >
              {data.users.map(user => (
                <Box key={user.id}>
                  <Text>
                    Vendedor{' '}
                    <Text as="span" fontWeight="bold">
                      {user.name}
                    </Text>
                    :
                  </Text>

                  <Box mt={2} pl={8}>
                    <TableContainer>
                      <Table mb={0} size="sm" w="full" variant="simple">
                        <Tbody>
                          {user.paymentMethods.map(({ description, value }) => (
                            <Tr key={description}>
                              <Td border={0}>{description}</Td>
                              <Td isNumeric border={0}>
                                {currencyFormat(value)}
                              </Td>
                            </Tr>
                          ))}
                          <Tr fontWeight="bold">
                            <Td fontSize="md" border={0}>
                              Total de vendas
                            </Td>
                            <Td fontSize="md" border={0} isNumeric>
                              {currencyFormat(
                                user.paymentMethods.reduce(
                                  (a, b) => a + b.value,
                                  0
                                )
                              )}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              ))}

              <Heading size="md" textAlign="center">
                Total geral de vendas: {currencyFormat(data.totalAmount)}
              </Heading>
            </Stack>
          </Card>
        </Stack>
      </Box>
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}
