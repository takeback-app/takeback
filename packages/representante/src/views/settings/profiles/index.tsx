import React from 'react'
import Layout from '../../../components/ui/Layout/Layout'
import {
  Alert,
  AlertIcon,
  Button,
  Card,
  CardBody,
  Stack,
  VStack,
  useDisclosure
} from '@chakra-ui/react'
import { EditPasswordModal } from './components/EditPasswordModal'

export function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Layout title="Perfil">
      <Stack spacing={4} p={4}>
        <Card bg="white">
          <CardBody>
            <VStack spacing={5} align="start">
              <Button onClick={onOpen}>Alterar senha</Button>
              <Alert status="warning">
                <AlertIcon />
                Ao alterar sua senha você será desconectado do sistema e
                precisará efetuar login novamente
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      </Stack>
      <EditPasswordModal isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}
