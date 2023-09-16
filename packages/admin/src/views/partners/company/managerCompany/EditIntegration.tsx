import React from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonGroup,
  Flex,
  SimpleGrid,
  Stack,
  useToast
} from '@chakra-ui/react'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { chakraToastConfig } from '../../../../styles/chakraToastConfig'

import useSWR from 'swr'
import Loader from 'react-spinners/PulseLoader'
import { updateIntegration } from '../../../../services/integrationApi'
import { RemoveIntegrationButton } from './RemoveIntegrationButton'
// import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'

interface Props {
  companyId: string
}

interface IntegrationResponse {
  id: string
  url: string
  type: 'DESKTOP'
  folderPath: string
}

const schema = z.object({
  folderPath: z.string().optional(),
  url: z.string().optional(),
  type: z.enum(['DESKTOP'])
})

export type IntegrationData = z.infer<typeof schema>

export function EditIntegration({ companyId }: Props) {
  const toast = useToast(chakraToastConfig)

  const {
    data: integration,
    error,
    mutate,
    isValidating
  } = useSWR<IntegrationResponse>(
    `manager/companies/${companyId}/integration`,
    {
      onSuccess(data) {
        setValue('url', data.url)
        setValue('folderPath', data.folderPath)
        setValue('type', data.type)
      }
    }
  )

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    register
  } = useForm<IntegrationData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'DESKTOP'
    }
  })

  async function onSubmit(data: IntegrationData) {
    if (!companyId) return

    const [isOk, response] = await updateIntegration(companyId, data)

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

    mutate()
  }

  if (isValidating) {
    return (
      <Flex w="full" py={10} align="center" justify="center">
        <Loader color="#4078D1" />
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex w="full" pt={2} align="center" justify="center">
        <Alert status="warning">
          <AlertIcon />
          <AlertDescription>
            {error.response?.data.message || error.message}
          </AlertDescription>
        </Alert>
      </Flex>
    )
  }

  return (
    <Stack mt={4} spacing={4}>
      <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
        {/* <ChakraSelect
          label="Tipo"
          size="sm"
          isRequired
          {...register('type')}
          error={errors.type?.message}
          options={[
            { text: 'Desktop', value: 'DESKTOP' },
            { text: 'QRCode', value: 'QRCODE' }
          ]}
        /> */}

        <ChakraInput
          label="URL"
          size="sm"
          isRequired
          {...register('url')}
          error={errors.url?.message}
        />
        <ChakraInput
          label="Localização da pasta"
          size="sm"
          {...register('folderPath')}
          error={errors.folderPath?.message}
        />
      </SimpleGrid>
      <Flex align="center" justify="flex-end">
        <ButtonGroup>
          {!!integration?.id && (
            <RemoveIntegrationButton
              integrationId={integration.id}
              onDeleted={() => mutate()}
            />
          )}
          <Button
            colorScheme="blue"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            {integration?.id ? 'Atualizar' : 'Criar'}
          </Button>
        </ButtonGroup>
      </Flex>
    </Stack>
  )
}
