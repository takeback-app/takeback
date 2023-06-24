import React, { useContext } from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  SimpleGrid,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { chakraToastOptions } from '../../../../components/ui/toast'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { IoAdd } from 'react-icons/io5'
import { AuthContext } from '../../../../contexts/AuthContext'
import { createNotificationSolicitation } from '../services/api'
import { useCreateNotificationSolicitation } from '../state'
import { useNavigate } from 'react-router'
import { ChakraTextArea } from '../../../../components/chakra/ChakraTextArea'

const schema = z.object({
  title: z.string(),
  message: z.string()
})

export type NotificationData = z.infer<typeof schema>

export function NotificationDataCard() {
  const navigateTo = useNavigate()

  const { audienceData, isAudienceGenerated, resetState } =
    useCreateNotificationSolicitation()

  const toast = useToast(chakraToastOptions)

  const { companyName } = useContext(AuthContext)

  const { register, formState, handleSubmit } = useForm<NotificationData>({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
    defaultValues: { title: `${companyName.toUpperCase()} avisa:` }
  })

  async function onSubmit(data: NotificationData) {
    const [isOk, response] = await createNotificationSolicitation({
      ...data,
      ...audienceData
    })

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

    resetState()

    navigateTo(-1)
  }

  return (
    <Card>
      <form style={{ margin: 0 }} onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <Heading fontSize="md">Dados da Notificação</Heading>
        </CardHeader>
        <Divider borderColor="gray.300" />
        <CardBody>
          <SimpleGrid columns={{ base: 1, lg: 2, xl: 3, '2xl': 4 }} gap={8}>
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
              placeholder="Digite a mensagem que será enviada para os usuários."
              max={100}
              size="sm"
              error={formState.errors.message?.message}
              {...register('message')}
            />
          </SimpleGrid>
        </CardBody>
        <CardFooter>
          <ButtonGroup ml="auto">
            <Button
              leftIcon={<IoAdd />}
              isDisabled={!isAudienceGenerated}
              isLoading={formState.isSubmitting}
              type="submit"
              colorScheme="green"
            >
              Criar
            </Button>
          </ButtonGroup>
        </CardFooter>
      </form>
    </Card>
  )
}
