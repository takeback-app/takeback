import React, { useState } from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Radio,
  SimpleGrid,
  Stack,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { IoCheckmarkSharp } from 'react-icons/io5'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { ChakraRadio } from '../../../components/chakra/ChakraRatio'
import { Layout } from '../../../components/ui/layout'
import { chakraToastOptions } from '../../../components/ui/toast'
import { maskCurrency, unMaskCurrency } from '../../../utils/masks'
import { ImagePreview } from './components/ImagePreview'
import { storeImage, storeRaffle } from './services/api'
import { uploadItemImages } from './services/uploadItemImages'
import { RafflesRules } from './components/RafflesRules'
import { CreateItemsCard, Item } from './components/CreateItemsCard'

const schema = z.object({
  title: z.string().nonempty('Campo obrigatório'),
  ticketValue: z.string().nonempty('Campo obrigatório'),
  drawDate: z.string().nonempty('Campo obrigatório'),
  file: z.instanceof(FileList),
  isOpenToOtherCompanies: z.string().nonempty('Campo obrigatório'),
  isOpenToEmployees: z.string().nonempty('Campo obrigatório'),
  pickUpLocation: z.string().nonempty('Campo obrigatório')
})

export type CreateRaffleData = z.infer<typeof schema>

export function RaffleCreate() {
  const navigateTo = useNavigate()

  const toast = useToast(chakraToastOptions)

  const [items, setItems] = useState<Item[]>([])

  const { register, formState, setValue, control, watch, handleSubmit } =
    useForm<CreateRaffleData>({
      resolver: zodResolver(schema)
    })

  const files = watch('file')

  async function onSubmit(data: CreateRaffleData) {
    if (!items.length) {
      return toast({
        title: 'Atenção',
        description: 'Não é possível criar um sorteio sem prêmios',
        status: 'warning'
      })
    }

    if (!data.file.length) {
      return toast({
        title: 'Atenção',
        description: 'Não é possível criar um sorteio sem a imagem do banner',
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

    const { errors, itemsWithImageUrl } = await uploadItemImages(items)

    if (errors.length) {
      return toast({
        title: 'Atenção',
        description: errors[0],
        status: 'error'
      })
    }

    const [isOk, storeData] = await storeRaffle({
      title: data.title,
      drawDate: new Date(data.drawDate).toISOString(),
      imageUrl: imageData.url,
      isOpenToOtherCompanies: data.isOpenToOtherCompanies === '1',
      isOpenToEmployees: data.isOpenToEmployees === '1',
      ticketValue: unMaskCurrency(data.ticketValue),
      pickUpLocation: data.pickUpLocation,
      items: itemsWithImageUrl
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

  return (
    <Layout title="Criar sorteio">
      <Stack overflowX="scroll" h="92vh" p={4} pb={6}>
        <RafflesRules />
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
                error={formState.errors.title?.message}
                {...register('title')}
              />

              <ChakraInput
                label="Valor do Cupom"
                size="sm"
                isRequired
                helpText="1 cupom a cada xxx reais"
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
                error={formState.errors.drawDate?.message}
                {...register('drawDate')}
              />

              <ChakraInput
                label="Local de Retirada"
                size="sm"
                isRequired
                error={formState.errors.pickUpLocation?.message}
                {...register('pickUpLocation')}
              />

              <ChakraInput
                label="Banner"
                size="sm"
                type="file"
                isRequired
                accept="image/*"
                error={formState.errors.file?.message}
                {...register('file')}
              />

              <Controller
                control={control}
                name="isOpenToOtherCompanies"
                render={({ field: { value, onChange } }) => (
                  <ChakraRadio
                    label="Aberto para outras empresas"
                    size="sm"
                    isRequired
                    value={value}
                    onChange={onChange}
                  >
                    <Radio value="1">Sim</Radio>
                    <Radio value="0">Não</Radio>
                  </ChakraRadio>
                )}
              />

              <Controller
                control={control}
                name="isOpenToEmployees"
                render={({ field: { value, onChange } }) => (
                  <ChakraRadio
                    label="Aberto para funcionários"
                    size="sm"
                    isRequired
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
        <CreateItemsCard items={items} setItems={setItems} />
        <Flex justify="flex-end" align="center">
          <ButtonGroup mt={2}>
            <Button
              leftIcon={<IoCheckmarkSharp size={20} />}
              isLoading={formState.isSubmitting}
              onClick={handleSubmit(onSubmit)}
              colorScheme="green"
            >
              Criar
            </Button>
          </ButtonGroup>
        </Flex>
      </Stack>
    </Layout>
  )
}
