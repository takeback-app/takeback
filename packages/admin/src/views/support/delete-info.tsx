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
  Link,
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

      {/* Exclusão sem acesso ao app */}
      <Box mb={8}>
        <Heading as="h2" size="lg" mb={4}>
          Solicitar exclusão sem acesso ao app
        </Heading>
        <Text mb={3}>
          Se você não tem mais acesso ao aplicativo, pode solicitar a exclusão
          da sua conta e dos seus dados diretamente com o nosso suporte:
        </Text>
        <List spacing={2}>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            WhatsApp:{' '}
            <Link
              href="https://wa.me/5538998330021?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20a%20exclus%C3%A3o%20da%20minha%20conta%20TakeBack."
              color="blue.300"
              isExternal
            >
              (38) 99833-0021
            </Link>
          </ListItem>
        </List>
        <Text mt={3}>
          Informe o CPF cadastrado para localizarmos sua conta. A exclusão será
          concluída em até 7 dias úteis.
        </Text>
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
