import React from 'react'

import { UseToastOptions } from '@chakra-ui/react'
import toastify, { Toaster } from 'react-hot-toast'

import * as Styles from './styles'

type toastPosition =
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'top-left'
  | 'top-right'

export type toastTypes = 'success' | 'info' | 'warn' | 'error'

interface ToastProps {
  title: string
  description?: string
  duration?: number
  position?: toastPosition
  type?: toastTypes
}

export function toast(props: ToastProps): string {
  return toastify.custom(<CustomToast {...props} />, {
    duration: props.duration || 2000,
    position: props.position || 'top-right'
  })
}

function CustomToast(props: ToastProps): JSX.Element {
  return (
    <Styles.Container type={props.type}>
      <Styles.Title>{props.title}</Styles.Title>
      {props.description && (
        <Styles.Description>{props.description}</Styles.Description>
      )}
    </Styles.Container>
  )
}

export const chakraToastOptions: UseToastOptions = {
  duration: 5000,
  position: 'top-right',
  isClosable: true
}

export default Toaster
