import React, { useMemo, useState } from 'react'

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
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import Loader from 'react-spinners/PulseLoader'

import useSWR from 'swr'

import { IoEye } from 'react-icons/io5'
import { Layout } from '../../../components/ui/layout'
import { chakraToastOptions } from '../../../components/ui/toast'
import {
  deleteLogoChangeRequest,
  storeImage,
  storeLogoChangeRequest
} from './services/api'
import { AppTable } from '../../../components/table'
import { CreateModal, LogoChangeCreateItemData } from './components/CreateModal'
import { DeleteButton } from './components/DeleteButton'

interface LogoChangeRequest {
  id: string
  logoUrl: string
  status: LogoChangeRequestStatus
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
  const toast = useToast(chakraToastOptions)

  const [selectedLogo, setLogo] = useState<string>()

  const {
    data: logoChangeRequests,
    isLoading,
    mutate
  } = useSWR<LogoChangeRequest[]>('company/logo-change-requests')

  const isCreateButtonDisabled = useMemo(
    () =>
      !!logoChangeRequests?.find(
        l => l.status === LogoChangeRequestStatus.CREATED
      ),
    [logoChangeRequests]
  )

  async function deleteWithdraw(id: string) {
    const [isOk, data] = await deleteLogoChangeRequest(id)

    if (!isOk) {
      return toast({
        title: 'Ops :(',
        description: data.message,
        status: 'error'
      })
    }

    await mutate()

    toast({
      title: 'Sucesso',
      description: data.message,
      status: 'success'
    })
  }

  async function onCreate(data: LogoChangeCreateItemData) {
    if (!data.file.length) {
      return toast({
        title: 'Atenção',
        description: 'Selecione uma imagem',
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

    const [isOk, storeData] = await storeLogoChangeRequest({
      logoUrl: imageData.url
    })

    if (!isOk) {
      return toast({
        title: 'Atenção',
        description: storeData.message,
        status: 'error'
      })
    }

    await mutate()

    toast({
      title: 'Sucesso',
      description: storeData.message,
      status: 'success'
    })
  }

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
        <Flex align="center" justify="flex-end">
          <CreateModal
            isDisabled={isCreateButtonDisabled}
            onSubmitNewLogo={onCreate}
          />
        </Flex>
        <AppTable
          dataLength={logoChangeRequests.length}
          noDataMessage="Nenhum solicitação"
          mt={4}
        >
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th isNumeric>Data de criação</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {logoChangeRequests?.map(({ createdAt, id, logoUrl, status }) => (
              <Tr color="gray.500" key={id}>
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
                      icon={<IoEye />}
                      onClick={() => {
                        setLogo(logoUrl)
                        onOpen()
                      }}
                    />

                    <DeleteButton
                      aria-label="delete"
                      isDisabled={status !== LogoChangeRequestStatus.CREATED}
                      handleDelete={() => deleteWithdraw(id)}
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
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
