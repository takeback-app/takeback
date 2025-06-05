import React from 'react'
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  Image,
  SimpleGrid,
  Divider,
  Stack
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import step1 from '../../assets/images/delete-account-step-1.png'
import step2 from '../../assets/images/delete-account-step-2.png'

const DeleteAccountInfo = () => {
  return (
    <Box
      overflow={'auto'}
      maxW="5xl"
      mx="auto"
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      bg="gray.900"
      color="white"
    >
      {/* Título */}
      <Heading as="h1" size="2xl" mb={6}>
        Exclusão de Conta - TakeBack
      </Heading>

      {/* Detalhes do App */}
      <Box mb={8}>
        <Heading as="h2" size="lg" mb={2}>
          Detalhes do App
        </Heading>
        <Text>
          <strong>Nome do App:</strong> TakeBack
        </Text>
      </Box>

      <Divider mb={6} />

      {/* Etapas para exclusão */}
      <Box mb={8}>
        <Heading as="h2" size="lg" mb={4}>
          Etapas para solicitar a exclusão da conta
        </Heading>
        <OrderedList spacing={3}>
          <ListItem>
            Acesse o menu de <strong>Configurações da Conta</strong>.
          </ListItem>
          <ListItem>
            Selecione a opção <strong>{'Excluir Conta'}</strong>.
          </ListItem>
          <ListItem>
            Leia atentamente as informações na tela de confirmação.
          </ListItem>
          <ListItem>
            Confirme a exclusão clicando em <strong>{'Excluir'}</strong>.
          </ListItem>
        </OrderedList>

        {/* Imagens de demonstração */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={6}>
          <Image
            src={step1}
            alt="Passo 1 - Acessar Configurações"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
          />
          <Image
            src={step2}
            alt="Passo 2 - Confirmar Exclusão"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
          />
        </SimpleGrid>
      </Box>

      <Divider mb={6} />

      {/* Dados excluídos e mantidos */}
      <Box mb={8}>
        <Heading as="h2" size="lg" mb={4}>
          Informações sobre dados
        </Heading>
        <Text mb={2}>
          Ao solicitar a exclusão da conta, os seguintes dados serão excluídos
          permanentemente:
        </Text>
        <List spacing={2} mb={4}>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            Dados pessoais (nome, email, telefone)
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            Dados de perfil e preferências
          </ListItem>
        </List>
      </Box>

      <Divider mb={6} />

      {/* Observações */}
      <Stack spacing={3}>
        <Heading as="h2" size="md">
          Observações Importantes
        </Heading>
        <Text>
          Após a solicitação de exclusão, não será possível recuperar sua conta
          nem seus dados. Caso tenha dúvidas, entre em contato com nosso
          suporte.
        </Text>
      </Stack>
    </Box>
  )
}

export default DeleteAccountInfo
