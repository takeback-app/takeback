import React, { useContext } from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  useToast
} from '@chakra-ui/react'

import useSWR from 'swr'

import { Layout } from '../../../components/ui/layout'
import { BlockModal } from '../../../components/modals/BlockModal'
import Loader from 'react-spinners/PulseLoader'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthContext } from '../../../contexts/AuthContext'
import { chakraToastOptions } from '../../../components/ui/toast'
import { createBirthdayNotification } from './services/api'
import { delay } from '../../../utils'
import { ChakraTextArea } from '../../../components/chakra/ChakraTextArea'

interface Response {
  numberOfCustomers: number
  numberOfNonCustomers: number
  hasSentToday: boolean
  hasAccess: boolean
}

const schema = z.object({
  title: z.string(),
  message: z.string()
})

export type NotificationData = z.infer<typeof schema>

export function BirthdayNotificationCreate() {
  const { companyName } = useContext(AuthContext)
  const toast = useToast(chakraToastOptions)

  const { data, isLoading, mutate } = useSWR<Response>(
    '/company/birthday-notifications'
  )

  const { register, formState, handleSubmit } = useForm<NotificationData>({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
    defaultValues: {
      title: `Parabéns pelo seu dia! 🎉🤩`,
      message: `${companyName.toUpperCase()} e toda nossa equipe lhe deseja um FELIZ ANIVERSÁRIO 🎂🎉`
    }
  })

  async function onSubmit(data: NotificationData) {
    const [isOk, response] = await createBirthdayNotification(data)

    if (!isOk) {
      return toast({
        title: 'Atenção',
        description: response.message,
        status: 'error'
      })
    }

    toast({
      title: 'Sucesso',
      description: response.message,
      status: 'success'
    })

    await delay(2000)

    mutate()
  }

  if (isLoading || !data) {
    return (
      <Layout title="Notificações">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  return (
    <>
      <Layout title="Notificação de Aniversário">
        <Stack overflowX="scroll" h="92vh" p={4} pb={6}>
          <Card>
            <form style={{ margin: 0 }} onSubmit={handleSubmit(onSubmit)}>
              <CardHeader>
                <Heading fontSize="md">Público de Aniversariantes</Heading>
              </CardHeader>
              <Divider borderColor="gray.300" />
              <CardBody>
                <StatGroup maxW="md">
                  <Stat>
                    <StatLabel>Clientes</StatLabel>
                    <StatNumber>{data.numberOfCustomers}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Ainda não clientes</StatLabel>
                    <StatNumber>{data.numberOfNonCustomers}</StatNumber>
                  </Stat>
                </StatGroup>
                <SimpleGrid
                  mt={8}
                  columns={{ base: 1, lg: 2, xl: 3, '2xl': 4 }}
                  gap={8}
                >
                  <ChakraInput
                    label="Titulo"
                    isReadOnly
                    size="sm"
                    error={formState.errors.title?.message}
                    {...register('title')}
                  />

                  <ChakraTextArea
                    isRequired
                    label="Mensagem"
                    isReadOnly
                    placeholder="Digite a mensagem que será enviada para os usuários."
                    max={100}
                    size="sm"
                    error={formState.errors.message?.message}
                    {...register('message')}
                  />
                </SimpleGrid>
              </CardBody>
              <CardFooter gap={2} flexDirection={{ base: 'column', sm: 'row' }}>
                <ButtonGroup ml="auto">
                  <Button
                    isLoading={formState.isSubmitting}
                    isDisabled={
                      !data.hasAccess ||
                      data.hasSentToday ||
                      !(data.numberOfCustomers + data.numberOfNonCustomers)
                    }
                    type="submit"
                    colorScheme="blue"
                  >
                    Enviar
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </form>
          </Card>
        </Stack>
      </Layout>
      <BlockModal
        title="Você não tem acesso a essa funcionalidade"
        subtitle="Busque a Takeback para receber mais informações sobre essa funcionalidade e como receber acesso a ela."
        isOpen={!data.hasAccess}
      />
      <BlockModal
        status="info"
        title="Você já enviou uma notificação de aniversário hoje"
        subtitle="Só é possível enviar uma notificação de aniversário por dia. Volte amanhã para enviar uma nova notificação."
        isOpen={data.hasSentToday}
      />
    </>
  )
}
