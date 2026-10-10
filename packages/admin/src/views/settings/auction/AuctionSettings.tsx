import React, { useEffect } from 'react'

import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { IoCheckmarkSharp } from 'react-icons/io5'
import { useNavigate } from 'react-router'
import useSWR from 'swr'
import { z } from 'zod'

import { ChakraInput } from '../../../components/chakra/ChakraInput'
import PageLoader from '../../../components/loaders/primaryLoader'
import Layout from '../../../components/ui/Layout'
import { chakraToastConfig } from '../../../styles/chakraToastConfig'
import { maskCurrency, unMaskCurrency } from '../../../utils/masks'
import { AuctionSettings, updateAuctionSettings } from './services/api'

const schema = z
  .object({
    isEnabled: z.boolean(),
    defaultDurationHours: z.string().nonempty('Informe o prazo padrão'),
    listingFee: z.string().nonempty('Informe a taxa de anúncio'),
    minimumStartingBid: z.string().nonempty('Informe o lance inicial mínimo'),
    defaultMinimumIncrement: z.string().nonempty('Informe o incremento padrão')
  })
  .refine(data => +data.defaultDurationHours >= 1, {
    message: 'O prazo deve ser de pelo menos 1 hora',
    path: ['defaultDurationHours']
  })
  .refine(data => +data.defaultDurationHours <= 720, {
    message: 'O prazo deve ser de no máximo 720 horas',
    path: ['defaultDurationHours']
  })
  .refine(data => unMaskCurrency(data.minimumStartingBid) > 0, {
    message: 'O lance inicial mínimo deve ser maior que zero',
    path: ['minimumStartingBid']
  })
  .refine(data => unMaskCurrency(data.defaultMinimumIncrement) > 0, {
    message: 'O incremento padrão deve ser maior que zero',
    path: ['defaultMinimumIncrement']
  })

type FormValues = z.infer<typeof schema>

const currencyMask = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    e.currentTarget.value = maskCurrency(e.currentTarget.value)
  }
}

export function AuctionSettingsView() {
  const navigateTo = useNavigate()
  const toast = useToast(chakraToastConfig)

  const { data: settings, mutate } = useSWR<AuctionSettings>(
    'manager/auction-settings'
  )

  const { register, handleSubmit, formState, reset, watch } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!settings) return

    reset({
      isEnabled: settings.isEnabled,
      defaultDurationHours: String(settings.defaultDurationHours),
      listingFee: maskCurrency(settings.listingFee),
      minimumStartingBid: maskCurrency(settings.minimumStartingBid),
      defaultMinimumIncrement: maskCurrency(settings.defaultMinimumIncrement)
    })
  }, [settings, reset])

  async function onSubmit(data: FormValues) {
    const [isOk, response] = await updateAuctionSettings({
      isEnabled: data.isEnabled,
      defaultDurationHours: parseInt(data.defaultDurationHours),
      listingFee: unMaskCurrency(data.listingFee),
      minimumStartingBid: unMaskCurrency(data.minimumStartingBid),
      defaultMinimumIncrement: unMaskCurrency(data.defaultMinimumIncrement)
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

    mutate()
  }

  if (!settings) {
    return (
      <Layout title="Desapega" goBack={() => navigateTo(-1)}>
        <Flex w="full" h="70vh" align="center" justify="center">
          <PageLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Desapega" goBack={() => navigateTo(-1)}>
      <Stack as="form" onSubmit={handleSubmit(onSubmit)} p={4} spacing={4}>
        <Alert status="info">
          <AlertIcon />
          As alterações valem apenas para anúncios publicados depois de salvar.
          Anúncios já publicados mantêm prazo, lance inicial e incremento.
        </Alert>

        <Card>
          <CardHeader>
            <Heading fontSize="md">Parâmetros do leilão</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody as={Stack} spacing={8}>
            <FormControl display="flex" alignItems="center" gap={3}>
              <Switch id="isEnabled" {...register('isEnabled')} />
              <FormLabel htmlFor="isEnabled" mb={0}>
                {watch('isEnabled')
                  ? 'Desapega ativo no aplicativo'
                  : 'Desapega desativado no aplicativo'}
              </FormLabel>
            </FormControl>

            <SimpleGrid columns={[1, 2, 4]} gap={8}>
              <Stack spacing={1}>
                <ChakraInput
                  label="Prazo padrão (horas)"
                  size="sm"
                  isRequired
                  inputMode="numeric"
                  error={formState.errors.defaultDurationHours?.message}
                  {...register('defaultDurationHours', {
                    onChange: e => {
                      e.currentTarget.value =
                        parseInt(e.currentTarget.value) || ''
                    }
                  })}
                />
                <Text fontSize="xs" color="gray.500">
                  Duração de cada anúncio a partir da publicação.
                </Text>
              </Stack>

              <ChakraInput
                label="Taxa de anúncio"
                size="sm"
                isRequired
                error={formState.errors.listingFee?.message}
                {...register('listingFee', currencyMask)}
              />

              <ChakraInput
                label="Lance inicial mínimo"
                size="sm"
                isRequired
                error={formState.errors.minimumStartingBid?.message}
                {...register('minimumStartingBid', currencyMask)}
              />

              <ChakraInput
                label="Incremento mínimo padrão"
                size="sm"
                isRequired
                error={formState.errors.defaultMinimumIncrement?.message}
                {...register('defaultMinimumIncrement', currencyMask)}
              />
            </SimpleGrid>
          </CardBody>
        </Card>

        <ButtonGroup justifyContent="flex-end">
          <Button
            colorScheme="green"
            leftIcon={<IoCheckmarkSharp />}
            type="submit"
            isLoading={formState.isSubmitting}
          >
            Salvar
          </Button>
        </ButtonGroup>
      </Stack>
    </Layout>
  )
}
