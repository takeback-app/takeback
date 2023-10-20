import React, { useState } from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  Spinner,
  Stack,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import Loader from 'react-spinners/PulseLoader'
import { Layout } from '../../../components/ui/layout'
import { ChakraInput } from './components/ChakraInput'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { chakraToastOptions } from '../../../components/ui/toast'
import { WithdrawModal } from './components/WithdrawModal'

export interface StoreOrderResponse {
  id: string
  consumer: {
    fullName: string
    cpf: string
  }
  quantity: number
  storeProduct: {
    name: string
    sellPrice: number
    buyPrice: number
    dateLimitWithdrawal: string
  }
  validationCode: string
  createdAt: string
  withdrawalAt: string
  companyUser: {
    name: string
  }
  wasWithdrawn: boolean
}

const schema = z.object({
  validationCode: z
    .string()
    .nonempty({ message: 'Campo não pode estar em branco' })
})

export type CashRegisterData = z.infer<typeof schema>

export function StoreOrders() {
  const [isLoading, setIsLoading] = useState(false)
  const [storeOrder, setStoreOrder] = useState<StoreOrderResponse>({
    id: '',
    consumer: {
      fullName: '',
      cpf: ''
    },
    quantity: 0,
    storeProduct: {
      name: '',
      sellPrice: 0,
      buyPrice: 0,
      dateLimitWithdrawal: ''
    },
    validationCode: '',
    createdAt: '',
    withdrawalAt: '',
    companyUser: {
      name: ''
    },
    wasWithdrawn: false
  })
  const withdrawModal = useDisclosure()

  const { ...form } = useForm<CashRegisterData>({
    resolver: zodResolver(schema),
    defaultValues: {
      validationCode: ''
    }
  })

  const toast = useToast(chakraToastOptions)

  function handleSubmit({ validationCode }: CashRegisterData) {
    console.log(validationCode)
    withdrawModal.onOpen()
  }

  async function handleConfirmation() {
    form.reset()
  }

  if (isLoading) {
    return (
      <Layout title="Retirada de produtos">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Loja de Ofertas">
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
                <Heading size="sm">Insira o código</Heading>
                {isLoading && <Spinner color="blue.500" size="sm" />}
              </Flex>
              <Divider borderColor="gray.400" />
              <CardBody>
                <Flex>
                  <Flex width={200} marginRight={5}>
                    <ChakraInput
                      isRequired
                      error={form.formState.errors.validationCode?.message}
                      autoComplete="off"
                      borderColor="gray.500"
                      label="Código de retirada"
                      {...form.register('validationCode')}
                    />
                  </Flex>
                  <ButtonGroup size="sm" alignItems={'end'}>
                    <Button colorScheme="green" type="submit">
                      Buscar
                    </Button>
                  </ButtonGroup>
                </Flex>
              </CardBody>
            </Card>
          </Stack>
        </form>
      </Flex>
      <WithdrawModal
        isOpen={withdrawModal.isOpen}
        storeOrder={storeOrder}
        onClose={withdrawModal.onClose}
        handleConfirmation={handleConfirmation}
      />
    </Layout>
  )
}
