import React, { useMemo, useState } from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Radio,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { IoCheckmarkSharp } from 'react-icons/io5'
import { useNavigate, useParams } from 'react-router'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { z } from 'zod'

import moment from 'moment'
import Loader from 'react-spinners/PulseLoader'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { ChakraRadio } from '../../../components/chakra/ChakraRatio'
import { Layout } from '../../../components/ui/layout'
import { chakraToastOptions } from '../../../components/ui/toast'
import { currencyFormat } from '../../../utils/currencyFormat'
import { maskCurrency, unMaskCurrency } from '../../../utils/masks'
import { ImagePreview } from './components/ImagePreview'
import { storeImage, updateRaffle } from './services/api'
import { uploadItemImages } from './services/uploadItemImages'
import { DrawRaffleButton } from './components/DrawRaffleButton'
import { EditItemsCard } from './components/EditItemsCard'
import { DetailsItemCard } from './components/DetailsItemCard'
import { RaffleStatus } from '.'
import {
  CompanyMultipleSelect,
  Option
} from './components/CompanyMultipleSelect'

const schema = z.object({
  title: z.string(),
  ticketValue: z.string(),
  drawDate: z.string(),
  file: z.instanceof(FileList).optional(),
  isOpenToOtherCompanies: z.string(),
  isOpenToEmployees: z.string(),
  pickUpLocation: z.string()
})

export type UpdateRaffleData = z.infer<typeof schema>

interface Company {
  company: {
    id: string
    fantasyName: string
  }
}
interface Raffle {
  id: string
  title: string
  imageUrl: string
  ticketValue: string
  drawDate: string
  isOpenToOtherCompanies: boolean
  isOpenToEmployees: boolean
  pickUpLocation: string
  companyId: string
  statusId: number
  createdAt: string
  updatedAt: string
  items: {
    id: string
    order: number
    description: string
    imageUrl: string
    winnerTicket?: {
      consumer: {
        fullName: string
        cpf: string
        phone: string
      }
    }
  }[]
  consumers: {
    id: string
    fullName: string
    cpf: string
    _count: {
      raffleTickets: number
    }
  }[]
  status: {
    id: number
    description: string
  }
  openToCompanyRaffles: Company[]
}

interface RaffleDetailsProps {
  type?: 'edit' | 'show'
}

export function RaffleDetails({ type = 'show' }: RaffleDetailsProps) {
  const navigateTo = useNavigate()
  const { id } = useParams()

  const toast = useToast(chakraToastOptions)

  const isReadOnly = useMemo(() => type === 'show', [type])

  const { isOpen, onClose, onOpen } = useDisclosure()
  // eslint-disable-next-line
  const [items, setItems] = useState<any[]>([])

  const {
    data: raffle,
    isLoading,
    mutate
  } = useSWR<Raffle>(`company/raffles/${id}`, {
    onSuccess
  })

  const { register, formState, setValue, watch, control, handleSubmit } =
    useForm<UpdateRaffleData>({
      resolver: zodResolver(schema)
    })

  const files = watch('file')
  const isOpenToOtherCompanies = watch('isOpenToOtherCompanies')

  const isPassedDrawDate = useMemo(() => {
    if (!raffle) return false

    return new Date(raffle.drawDate) <= new Date()
  }, [raffle])

  const [selectedCompanies, setSelectedCompanies] = useState<Option[]>([])

  async function onSubmit(data: UpdateRaffleData) {
    if (!items.length) {
      return toast({
        title: 'Atenção',
        description: 'Não é possível criar um sorteio sem prêmios',
        status: 'warning'
      })
    }

    let imageUrl: string | undefined

    if (data.file?.length) {
      const [isImageOk, imageData] = await storeImage(data.file[0])

      if (!isImageOk) {
        return toast({
          title: 'Atenção',
          description: imageData.message,
          status: 'error'
        })
      }

      imageUrl = imageData.url
    }

    if (!id) return

    const { errors, itemsWithImageUrl } = await uploadItemImages(items)

    if (errors.length) {
      return toast({
        title: 'Atenção',
        description: errors[0],
        status: 'error'
      })
    }

    const openToOtherCompanies: string[] = selectedCompanies.map(
      (company: Option) => String(company.value)
    )

    const [isOk, storeData] = await updateRaffle(id, {
      title: data.title,
      drawDate: new Date(data.drawDate).toISOString(),
      imageUrl,
      isOpenToOtherCompanies: data.isOpenToOtherCompanies === '1',
      isOpenToEmployees: data.isOpenToEmployees === '1',
      ticketValue: unMaskCurrency(data.ticketValue),
      pickUpLocation: data.pickUpLocation,
      items: itemsWithImageUrl,
      openToOtherCompanies
    })

    if (!isOk) {
      return toast({
        title: 'Atenção',
        description: storeData.message,
        status: 'error'
      })
    }

    toast({
      title: 'Sucesso',
      description: storeData.message,
      status: 'success'
    })

    navigateTo(-1)
  }

  function onSuccess(data: Raffle) {
    setValue('title', data.title)
    setValue('ticketValue', currencyFormat(Number(data.ticketValue)))
    setValue('drawDate', moment(data.drawDate).format('YYYY-MM-DD'))
    setValue('pickUpLocation', data.pickUpLocation)
    setValue('isOpenToOtherCompanies', data.isOpenToOtherCompanies ? '1' : '0')
    setValue('isOpenToEmployees', data.isOpenToEmployees ? '1' : '0')
    setItems(data.items)

    setSelectedCompanies(
      data.openToCompanyRaffles.map(company => {
        return {
          label: company.company.fantasyName,
          value: company.company.id
        }
      })
    )
  }

  if (isLoading) {
    return (
      <Layout title={isReadOnly ? 'Detalhes do Sorteio' : 'Editar sorteio'}>
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title={isReadOnly ? 'Detalhes do Sorteio' : 'Editar sorteio'}>
      <Stack overflowX="scroll" h="92vh" p={4} pb={6}>
        <Card>
          <CardHeader>
            <Heading fontSize="md">Detalhes</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="Título"
                size="sm"
                isRequired
                isReadOnly={isReadOnly}
                error={formState.errors.title?.message}
                {...register('title')}
              />

              <ChakraInput
                label="Valor do Cupom"
                size="sm"
                isRequired
                helpText="Ganha 1 cupom a cada X reais"
                isReadOnly={isReadOnly}
                error={formState.errors.ticketValue?.message}
                {...register('ticketValue', {
                  onChange: e =>
                    setValue('ticketValue', maskCurrency(e.currentTarget.value))
                })}
              />
              <ChakraInput
                label="Data do sorteio"
                size="sm"
                type="date"
                isRequired
                isReadOnly={isReadOnly}
                error={formState.errors.drawDate?.message}
                {...register('drawDate')}
              />

              <ChakraInput
                label="Local de Retirada"
                size="sm"
                isRequired
                isReadOnly={isReadOnly}
                error={formState.errors.pickUpLocation?.message}
                {...register('pickUpLocation')}
              />

              {!isReadOnly && (
                <ChakraInput
                  label="Banner"
                  size="sm"
                  type="file"
                  accept="image/*"
                  error={formState.errors.file?.message}
                  {...register('file')}
                />
              )}

              <Flex align="flex-end" justify="stretch">
                <Button flex={1} colorScheme="blue" size="sm" onClick={onOpen}>
                  Visualizar imagem (Banner)
                </Button>
              </Flex>

              <Controller
                control={control}
                name="isOpenToOtherCompanies"
                render={({ field: { value, onChange } }) => (
                  <ChakraRadio
                    label="Aberto para outras empresas"
                    size="sm"
                    isRequired
                    isReadOnly={isReadOnly}
                    value={value}
                    onChange={onChange}
                  >
                    <Radio value="1">Sim</Radio>
                    <Radio value="0">Não</Radio>
                  </ChakraRadio>
                )}
              />

              {isOpenToOtherCompanies === '1' && (
                <CompanyMultipleSelect
                  label="Empresas participantes"
                  size="sm"
                  isReadOnly={isReadOnly}
                  selectedOptions={selectedCompanies}
                  setSelectedOptions={setSelectedCompanies}
                />
              )}

              <Controller
                control={control}
                name="isOpenToEmployees"
                render={({ field: { value, onChange } }) => (
                  <ChakraRadio
                    label="Aberto para funcionários"
                    size="sm"
                    isRequired
                    isReadOnly={isReadOnly}
                    value={value}
                    onChange={onChange}
                  >
                    <Radio value="1">Sim</Radio>
                    <Radio value="0">Não</Radio>
                  </ChakraRadio>
                )}
              />
            </SimpleGrid>

            {files && files.length ? <ImagePreview file={files[0]} /> : null}
          </CardBody>
        </Card>
        {isReadOnly ? (
          <DetailsItemCard
            isDelivering={
              raffle?.status.description === RaffleStatus.DELIVERING
            }
            items={items}
          />
        ) : (
          <EditItemsCard items={items} setItems={setItems} />
        )}

        <Card>
          <CardHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading fontSize="md">Cupons</Heading>
            <Heading fontSize="md">
              Total:{' '}
              {raffle?.consumers.reduce(
                (a, b) => a + b._count.raffleTickets,
                0
              ) ?? 0}
            </Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody as={Stack} overflowX="auto" maxH="sm">
            {!raffle?.consumers.length ? (
              <Text textAlign="center" color="gray.400" fontWeight="semibold">
                Nenhum cupom ainda
              </Text>
            ) : null}
            {raffle?.consumers.map(consumer => (
              <Flex key={consumer.id}>
                <Text>
                  {consumer.fullName} - {consumer._count.raffleTickets} cupons
                </Text>
              </Flex>
            ))}
          </CardBody>
        </Card>
        <Flex justify="flex-end" align="center">
          <ButtonGroup mt={2}>
            <Button
              leftIcon={<IoCheckmarkSharp size={20} />}
              isLoading={formState.isSubmitting}
              onClick={handleSubmit(onSubmit)}
              hidden={isReadOnly}
              colorScheme="green"
            >
              Atualizar
            </Button>
            <DrawRaffleButton
              id={raffle?.id ?? ''}
              isHidden={
                !isReadOnly ||
                !isPassedDrawDate ||
                raffle?.status.description !== RaffleStatus.APPROVED
              }
              onComplete={async () => {
                await mutate()
              }}
            />
          </ButtonGroup>
        </Flex>
      </Stack>

      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={4}>
            <Image m={0} w="full" src={raffle?.imageUrl} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  )
}
