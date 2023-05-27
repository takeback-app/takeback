import React, { useState } from 'react'

import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure
} from '@chakra-ui/react'
import Loader from 'react-spinners/PulseLoader'

import useSWR from 'swr'

import { IoEye } from 'react-icons/io5'

import Layout from '../../../components/ui/Layout/Layout'
import { AppTable } from '../../../components/tables'
import { ApproveButton } from './components/ApproveButton'
import { ReproveButton } from './components/ReproveButton'

interface LogoChangeRequest {
  id: string
  logoUrl: string
  status: LogoChangeRequestStatus
  company: {
    fantasyName: string
  }
  createdAt: string
}

export enum LogoChangeRequestStatus {
  APPROVED = 'APPROVED',
  REPROVED = 'REPROVED',
  CREATED = 'CREATED'
}

const statusColor: { [key in LogoChangeRequestStatus]: string } = {
  CREATED: 'yellow.500',
  APPROVED: 'green.500',
  REPROVED: 'red.500'
}

const statusText: { [key in LogoChangeRequestStatus]: string } = {
  CREATED: 'Aguardando aprovação',
  APPROVED: 'Aprovado',
  REPROVED: 'Reprovado'
}

export function LogoChangeRequest() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [selectedLogo, setLogo] = useState<string>()

  const {
    data: logoChangeRequests,
    isLoading,
    mutate
  } = useSWR<LogoChangeRequest[]>('manager/logo-change-requests')

  if (isLoading || !logoChangeRequests) {
    return (
      <Layout title="Troca de Logo">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Troca de Logo">
      <Box p={4}>
        <AppTable
          dataLength={logoChangeRequests.length}
          noDataMessage="Nenhum solicitação"
          mt={4}
        >
          <Thead>
            <Tr>
              <Th>Empresa</Th>
              <Th>Status</Th>
              <Th isNumeric>Data de criação</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {logoChangeRequests?.map(
              ({ createdAt, id, logoUrl, company, status }) => (
                <Tr color="gray.500" key={id}>
                  <Td fontSize="xs">{company.fantasyName}</Td>
                  <Td fontSize="xs" color={statusColor[status]}>
                    {statusText[status]}
                  </Td>
                  <Td fontSize="xs" isNumeric>
                    {new Date(createdAt).toLocaleDateString()}
                  </Td>
                  <Td isNumeric>
                    <ButtonGroup>
                      <IconButton
                        size="sm"
                        aria-label="view"
                        variant="ghost"
                        icon={<IoEye />}
                        onClick={() => {
                          setLogo(logoUrl)
                          onOpen()
                        }}
                      />
                      <ApproveButton onApprove={() => mutate()} id={id} />
                      <ReproveButton onReprove={() => mutate()} id={id} />
                    </ButtonGroup>
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </AppTable>
      </Box>

      {selectedLogo ? (
        <Modal size="xl" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalBody p={4}>
              <Image m={0} w="full" src={selectedLogo} />
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}
    </Layout>
  )
}
