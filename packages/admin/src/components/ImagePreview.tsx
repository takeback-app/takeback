import React from 'react'

import { FormControl, FormLabel, Image } from '@chakra-ui/react'

export function ImagePreview({ file }: { file: File }) {
  return (
    <FormControl mt={4}>
      <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600">
        Preview da Imagem
      </FormLabel>
      <Image
        border="2px"
        borderColor="gray.400"
        shadow="lg"
        borderRadius="lg"
        h={48}
        mb={0}
        src={URL.createObjectURL(file)}
      />
    </FormControl>
  )
}
