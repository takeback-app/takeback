import React, { useState } from 'react'
import { Layout } from '../../../components/ui/layout'
import {
  Badge,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure
} from '@chakra-ui/react'

import useSWR from 'swr'

import { AppTable } from '../../../components/table'
import { IoBarcodeOutline, IoPencil, IoTrash } from 'react-icons/io5'
import { percentFormat } from '../../../utils/percentFormat'
import Loader from 'react-spinners/PulseLoader'
import { z } from 'zod'
import { EditModal } from './components/EditModal'
import { DeleteModal } from './components/DeleteModal'
import { CreateModal } from './components/CreateModal'
import { EditIntegrationModal } from './components/EditIntegrationModal'

export interface CompanyPaymentMethod {
  id: number
  paymentMethod: {
    description: string
  }
  tPag: number
  isActive: boolean
  cashbackPercentage: number
}

const schema = z.object({
  cashbackPercentage: z.number(),
  isActive: z.enum(['active', 'inactive']).optional()
})

export type PaymentMethodData = z.infer<typeof schema>

export function PaymentMethods() {
  const editDisclosure = useDisclosure()
  const createDisclosure = useDisclosure()
  const editIntegrationDisclosure = useDisclosure()
  const deleteDisclosure = useDisclosure()

  const [companyPaymentMethod, setCompanyPaymentMethod] =
    useState<CompanyPaymentMethod>()

  const {
    data: companyPaymentMethods,
    isLoading,
    mutate
  } = useSWR<CompanyPaymentMethod[]>('company/company-payment-methods')

  const { data: integrationData } = useSWR<{ integrationType: string }>(
    'company/integrations/type'
  )

  if (isLoading || !companyPaymentMethods) {
    return (
      <Layout title="Saque">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Métodos de pagamento">
      <Flex px={4} direction="column">
        <Flex pt={4} w="full" justify="flex-end">
          <Button colorScheme="blue" onClick={createDisclosure.onOpen}>
            Criar
          </Button>
        </Flex>
        <AppTable
          mt={4}
          dataLength={companyPaymentMethods?.length || 0}
          noDataMessage="Nenhum método de pagamento"
        >
          <Thead>
            <Tr>
              <Th>Descrição</Th>
              <Th>Porcentagem</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {companyPaymentMethods?.map(item => (
              <Tr color="gray.500" key={item.id}>
                <Td fontSize="xs">{item.paymentMethod.description}</Td>
                <Td fontSize="xs">{percentFormat(item.cashbackPercentage)}</Td>
                <Td fontSize="xs">
                  <Badge colorScheme={item.isActive ? 'green' : 'red'}>
                    {item.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </Td>
                <Td isNumeric>
                  <ButtonGroup>
                    <Tooltip label="Editar">
                      <IconButton
                        size="sm"
                        aria-label="edit"
                        icon={<IoPencil />}
                        onClick={() => {
                          setCompanyPaymentMethod(item)
                          editDisclosure.onOpen()
                        }}
                      />
                    </Tooltip>

                    <Tooltip label="Remover">
                      <IconButton
                        size="sm"
                        colorScheme="red"
                        aria-label="remove"
                        icon={<IoTrash />}
                        onClick={() => {
                          setCompanyPaymentMethod(item)
                          deleteDisclosure.onOpen()
                        }}
                      />
                    </Tooltip>

                    {integrationData?.integrationType === 'DESKTOP' && (
                      <Tooltip label="Editar Equivalência na integração">
                        <IconButton
                          size="sm"
                          colorScheme="orange"
                          aria-label="edit-integration"
                          icon={<IoBarcodeOutline />}
                          onClick={() => {
                            setCompanyPaymentMethod(item)
                            editIntegrationDisclosure.onOpen()
                          }}
                        />
                      </Tooltip>
                    )}
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
      </Flex>

      <CreateModal
        isOpen={createDisclosure.isOpen}
        onClose={createDisclosure.onClose}
        onCreated={mutate}
      />

      {companyPaymentMethod && (
        <>
          <DeleteModal
            isOpen={deleteDisclosure.isOpen}
            onClose={deleteDisclosure.onClose}
            onDeleted={mutate}
            companyPaymentMethod={companyPaymentMethod}
          />

          <EditModal
            isOpen={editDisclosure.isOpen}
            onClose={editDisclosure.onClose}
            onEdited={mutate}
            companyPaymentMethod={companyPaymentMethod}
          />

          <EditIntegrationModal
            isOpen={editIntegrationDisclosure.isOpen}
            onClose={editIntegrationDisclosure.onClose}
            onEdited={mutate}
            companyPaymentMethod={companyPaymentMethod}
          />
        </>
      )}
    </Layout>
  )
}
