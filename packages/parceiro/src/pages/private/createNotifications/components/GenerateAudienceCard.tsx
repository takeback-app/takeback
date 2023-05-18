import React from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Radio,
  SimpleGrid,
  Text,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { chakraToastOptions } from '../../../../components/ui/toast'
import { ChakraRadio } from '../../../../components/chakra/ChakraRatio'
import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { maskCurrency, unMaskCurrency } from '../../../../utils/masks'
import { getAudienceCount } from '../services/api'
import { useCreateNotificationSolicitation } from '../state'

const audienceSchema = z
  .object({
    audienceSex: z.enum(['MALE', 'FEMALE', 'ALL']),
    minAudienceAge: z.number().positive().int().optional(),
    maxAudienceAge: z.number().positive().int().optional(),
    ageCheck: z.boolean(),
    audienceBalance: z.string().optional(),
    balanceCheck: z.boolean(),
    storeVisitType: z.enum(['NEVER', 'FROM_THE_DATE_OF_PURCHASE', 'ALL']),
    dateOfPurchase: z.string().optional(),
    hasChildren: z.enum(['yes', 'no', 'both'])
  })
  .refine(
    ({ ageCheck, minAudienceAge, maxAudienceAge }) => {
      if (ageCheck) return true

      return !!minAudienceAge && !!maxAudienceAge
    },
    { path: ['ageCheck'], message: 'Campos obrigatórios' }
  )
  .refine(
    ({ balanceCheck, audienceBalance }) => {
      if (balanceCheck) return true

      return !!audienceBalance
    },
    { path: ['balanceCheck'], message: 'Campo obrigatório' }
  )
  .refine(
    ({ storeVisitType, dateOfPurchase }) => {
      if (storeVisitType !== 'FROM_THE_DATE_OF_PURCHASE') return true

      return !!dateOfPurchase
    },
    { path: ['dateOfPurchase'], message: 'Campo obrigatório' }
  )
  .refine(
    ({ dateOfPurchase }) => {
      if (!dateOfPurchase) return true

      return new Date(dateOfPurchase).getTime() <= new Date().getTime()
    },
    { path: ['dateOfPurchase'], message: 'Data futura não é permitida' }
  )

export type GenerateNotificationAudienceData = z.infer<typeof audienceSchema>

export function GenerateAudienceCard() {
  const {
    setValue: setStateValue,
    audienceCount,
    isAudienceGenerated
  } = useCreateNotificationSolicitation()

  const toast = useToast(chakraToastOptions)

  const { register, formState, control, setValue, watch, handleSubmit } =
    useForm<GenerateNotificationAudienceData>({
      mode: 'onSubmit',
      resolver: zodResolver(audienceSchema),
      defaultValues: {
        audienceSex: 'ALL',
        hasChildren: 'both',
        ageCheck: true,
        balanceCheck: true,
        storeVisitType: 'ALL'
      }
    })

  const { ref: minAudienceAgeRegisterRef } = register('minAudienceAge')

  const { ref: maxAudienceAgeRegisterRef } = register('maxAudienceAge')

  const [isAgeChecked, isBalanceChecked, storeVisitType] = watch([
    'ageCheck',
    'balanceCheck',
    'storeVisitType'
  ])

  async function onSubmit(data: GenerateNotificationAudienceData) {
    const audienceData = {
      audienceSex: data.audienceSex,
      storeVisitType: data.storeVisitType,
      maxAudienceAge: data.maxAudienceAge,
      minAudienceAge: data.minAudienceAge,
      hasChildren:
        data.hasChildren === 'yes'
          ? true
          : data.hasChildren === 'no'
          ? false
          : undefined,
      audienceBalance: data.audienceBalance
        ? unMaskCurrency(data.audienceBalance)
        : undefined,
      dateOfPurchase: data.dateOfPurchase
        ? new Date(data.dateOfPurchase).toISOString()
        : undefined
    }

    const [isOk, response] = await getAudienceCount(audienceData)

    if (!isOk) {
      return toast({
        title: 'Atenção',
        description: response.message,
        status: 'error'
      })
    }

    setStateValue('audienceCount', response.count)

    if (response.count === 0) {
      return toast({
        title: 'Atenção',
        description: 'Não é possível gerar público com os filtros selecionados',
        status: 'warning'
      })
    }

    setStateValue('audienceData', audienceData)
    setStateValue('isAudienceGenerated', true)
  }

  return (
    <Card>
      <form style={{ margin: 0 }} onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <Heading fontSize="md">Gerar Público</Heading>
        </CardHeader>
        <Divider borderColor="gray.300" />
        <CardBody>
          <SimpleGrid columns={{ base: 1, lg: 2, xl: 3, '2xl': 4 }} gap={8}>
            <Controller
              control={control}
              name="audienceSex"
              render={({
                field: { name, onChange, value },
                fieldState: { error }
              }) => (
                <ChakraRadio
                  isReadOnly={isAudienceGenerated}
                  isRequired
                  label="Sexo"
                  name={name}
                  value={value}
                  onChange={onChange}
                  defaultValue="ALL"
                  error={error?.message}
                >
                  <Radio value="MALE">Masculino</Radio>
                  <Radio value="FEMALE">Feminino</Radio>
                  <Radio value="ALL">Ambos</Radio>
                </ChakraRadio>
              )}
            />

            <Controller
              control={control}
              name="hasChildren"
              render={({
                field: { name, onChange, value },
                fieldState: { error }
              }) => (
                <ChakraRadio
                  isReadOnly={isAudienceGenerated}
                  label="Tem filhos?"
                  isRequired
                  defaultValue="both"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                >
                  <Radio value="yes">Sim</Radio>
                  <Radio value="no">Não</Radio>
                  <Radio value="both">Ambos</Radio>
                </ChakraRadio>
              )}
            />

            <FormControl
              isInvalid={
                !!formState.errors.ageCheck ||
                !!formState.errors.minAudienceAge ||
                !!formState.errors.maxAudienceAge
              }
            >
              <Flex mb={2} align="center">
                <FormLabel
                  mb={0}
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.600"
                >
                  Idade
                </FormLabel>
                <Checkbox
                  defaultChecked
                  isReadOnly={isAudienceGenerated}
                  isInvalid={!!formState.errors.ageCheck}
                  size="sm"
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.600"
                  {...register('ageCheck')}
                >
                  Todas as idades
                </Checkbox>
              </Flex>
              <HStack>
                <NumberInput
                  size="sm"
                  isReadOnly={isAudienceGenerated}
                  isDisabled={isAgeChecked}
                  isInvalid={!!formState.errors.minAudienceAge}
                  step={1}
                  min={13}
                  max={130}
                  onChange={value => setValue('minAudienceAge', Number(value))}
                >
                  <NumberInputField
                    placeholder="de"
                    ref={minAudienceAgeRegisterRef}
                  />
                </NumberInput>
                <NumberInput
                  size="sm"
                  isReadOnly={isAudienceGenerated}
                  isDisabled={isAgeChecked}
                  isInvalid={!!formState.errors.maxAudienceAge}
                  step={1}
                  min={13}
                  max={130}
                  onChange={value => setValue('maxAudienceAge', Number(value))}
                >
                  <NumberInputField
                    placeholder="até"
                    ref={maxAudienceAgeRegisterRef}
                  />
                </NumberInput>
              </HStack>
              <FormErrorMessage>
                {formState.errors.ageCheck?.message ||
                  formState.errors.minAudienceAge?.message ||
                  formState.errors.maxAudienceAge?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                !!formState.errors.balanceCheck ||
                !!formState.errors.audienceBalance
              }
            >
              <Flex mb={2} align="center">
                <FormLabel
                  mb={0}
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.600"
                >
                  Saldo Takeback acima de:
                </FormLabel>
                <Checkbox
                  isReadOnly={isAudienceGenerated}
                  defaultChecked
                  size="sm"
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.600"
                  {...register('balanceCheck', {
                    onChange: () => setValue('audienceBalance', undefined)
                  })}
                >
                  Qualquer Saldo
                </Checkbox>
              </Flex>
              <Input
                isReadOnly={isAudienceGenerated}
                isDisabled={isBalanceChecked}
                size="sm"
                placeholder="R$"
                min={13}
                step={1}
                {...register('audienceBalance', {
                  onChange: e =>
                    setValue(
                      'audienceBalance',
                      maskCurrency(e.currentTarget.value)
                    )
                })}
              />
              <FormErrorMessage>
                {formState.errors.balanceCheck?.message ||
                  formState.errors.audienceBalance?.message}
              </FormErrorMessage>
            </FormControl>

            <ChakraSelect
              isRequired
              isReadOnly={isAudienceGenerated}
              label="Visitas na minha loja"
              defaultValue="ALL"
              size="sm"
              {...register('storeVisitType')}
              options={[
                { text: 'Nunca comprou na minha loja', value: 'NEVER' },
                {
                  text: 'Última compra até o dia:',
                  value: 'FROM_THE_DATE_OF_PURCHASE'
                },
                { text: 'Todos os clientes', value: 'ALL' }
              ]}
            />

            <ChakraInput
              isReadOnly={isAudienceGenerated}
              isRequired={storeVisitType === 'FROM_THE_DATE_OF_PURCHASE'}
              isDisabled={storeVisitType !== 'FROM_THE_DATE_OF_PURCHASE'}
              label="Última compra até o dia:"
              type="date"
              size="sm"
              error={formState.errors.dateOfPurchase?.message}
              {...register('dateOfPurchase')}
            />
          </SimpleGrid>
        </CardBody>
        <CardFooter gap={2} flexDirection={{ base: 'column', sm: 'row' }}>
          <Text color="gray.600" fontWeight="semibold">
            Quantidade de clientes afetados: {audienceCount ?? '-'}
          </Text>
          <ButtonGroup ml="auto">
            <Button
              display={isAudienceGenerated ? 'none' : 'block'}
              isLoading={formState.isSubmitting}
              type="submit"
              colorScheme="blue"
            >
              Gerar
            </Button>

            <Button
              display={isAudienceGenerated ? 'block' : 'none'}
              isLoading={formState.isSubmitting}
              onClick={() => {
                setStateValue('isAudienceGenerated', false)
                setStateValue('audienceCount', undefined)
              }}
              colorScheme="yellow"
            >
              Mudar
            </Button>
          </ButtonGroup>
        </CardFooter>
      </form>
    </Card>
  )
}
