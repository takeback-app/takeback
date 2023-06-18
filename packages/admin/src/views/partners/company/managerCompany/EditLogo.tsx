import React, { useEffect, useState } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Flex,
  Image,
  SimpleGrid,
  Stack,
  useToast
} from '@chakra-ui/react'
import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { chakraToastConfig } from '../../../../styles/chakraToastConfig'
import { storeImage, updateCompanyLogo } from './api'

interface Props {
  companyId: string
  companyLogoUrl: string | null
}

const schema = z.object({
  file: z.instanceof(FileList)
})

export type LogoChangeCreateItemData = z.infer<typeof schema>

export function EditLogo({ companyId, companyLogoUrl }: Props) {
  const toast = useToast(chakraToastConfig)

  const [logoUrl, setLogoUrl] = useState<string>('')

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register
  } = useForm<LogoChangeCreateItemData>({
    resolver: zodResolver(schema)
  })

  async function onSubmit(data: LogoChangeCreateItemData) {
    if (!companyId) return

    if (!data.file.length) {
      return toast({
        title: 'Atenção',
        description: 'Selecione uma imagem',
        status: 'warning'
      })
    }

    const [isImageOk, imageData] = await storeImage(data.file[0], {
      resize: '320'
    })

    if (!isImageOk) {
      return toast({
        title: 'Atenção',
        description: imageData.message,
        status: 'error'
      })
    }

    const [isOk, updateData] = await updateCompanyLogo(companyId, imageData.url)

    if (!isOk) {
      return toast({
        title: 'Atenção',
        description: updateData.message,
        status: 'error'
      })
    }

    toast({
      title: 'Sucesso',
      description: updateData.message,
      status: 'success'
    })
  }

  useEffect(() => {
    setLogoUrl(companyLogoUrl ?? '')
  }, [companyLogoUrl])

  return (
    <Stack mt={4} spacing={4}>
      <Image
        border="2px"
        borderColor="gray.400"
        shadow="lg"
        objectFit="cover"
        borderRadius="lg"
        w={48}
        h={48}
        mb={0}
        src={logoUrl}
        fallbackSrc="https://via.placeholder.com/320"
      />
      <SimpleGrid columns={[1, 2, 3]} gap={8}>
        <ChakraInput
          label="Logo"
          size="sm"
          type="file"
          isRequired
          accept="image/*"
          error={errors.file?.message}
          {...register('file', {
            onChange: e => {
              setLogoUrl(URL.createObjectURL(e.target.files[0]))
            }
          })}
        />
      </SimpleGrid>
      <Flex align="center" justify="flex-end">
        <Button
          colorScheme="blue"
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        >
          Trocar
        </Button>
      </Flex>
    </Stack>
  )
}
