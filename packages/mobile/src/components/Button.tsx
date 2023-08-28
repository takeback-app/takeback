import React from 'react'
import { IButtonProps, Button as NativeButton } from 'native-base'

export function Button({ children, ...rest }: IButtonProps) {
  return (
    <NativeButton
      px={6}
      py={3}
      colorScheme="blue"
      rounded="full"
      _text={{
        fontSize: 'md',
        fontWeight: 'semibold'
      }}
      {...rest}
    >
      {children}
    </NativeButton>
  )
}
