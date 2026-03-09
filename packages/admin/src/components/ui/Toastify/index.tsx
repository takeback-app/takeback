import { createStandaloneToast } from '@chakra-ui/react'

const { toast } = createStandaloneToast()

export const notifyError = (message: string) =>
  toast({
    position: 'top',
    duration: 5000,
    description: message,
    isClosable: true,
    status: 'error'
  })

export const notifySuccess = (message: string) =>
  toast({
    position: 'top',
    duration: 5000,
    description: message,
    isClosable: true,
    status: 'success'
  })

export const notifyInfo = (message: string) =>
  toast({
    position: 'top',
    duration: 5000,
    description: message,
    isClosable: true,
    status: 'info'
  })

export const notifyWarn = (message: string) =>
  toast({
    position: 'top',
    duration: 5000,
    description: message,
    isClosable: true,
    status: 'warning'
  })

export default function Toastify() {
  return null
}
