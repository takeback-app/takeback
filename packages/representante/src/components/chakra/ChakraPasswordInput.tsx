import React from 'react'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement
} from '@chakra-ui/react'
import { IoEye, IoEyeOff } from 'react-icons/io5'

interface ChakraPasswordInputProps extends InputProps {
  isRequired?: boolean
  isLoading?: boolean
  label?: string
  error?: string
  children?: React.ReactNode
}

const ChakraPasswordInput = React.forwardRef<
  HTMLInputElement,
  ChakraPasswordInputProps
>(
  (
    {
      label,
      children,
      display,
      gridColumnStart,
      gridColumnEnd,
      isRequired = false,
      isLoading = false,
      ...rest
    },
    ref
  ) => {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
      <FormControl
        gridColumnStart={gridColumnStart}
        gridColumnEnd={gridColumnEnd}
        display={display}
        isRequired={isRequired}
        isInvalid={!!rest.error}
      >
        {label && (
          <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600">
            {label}
          </FormLabel>
        )}

        <InputGroup>
          <Input
            autoFocus={rest.autoFocus}
            type={show ? 'text' : 'password'}
            ref={ref}
            {...rest}
          />

          <InputRightElement color="gray.300" width="2rem">
            {show ? (
              <IconButton
                size="xs"
                aria-label="hide"
                variant="ghost"
                icon={<IoEyeOff />}
                onClick={handleClick}
              />
            ) : (
              <IconButton
                size="xs"
                aria-label="hide"
                variant="ghost"
                icon={<IoEye />}
                onClick={handleClick}
              />
            )}
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{rest.error}</FormErrorMessage>
        {children}
      </FormControl>
    )
  }
)

ChakraPasswordInput.displayName = 'ChakraPasswordInput'

export { ChakraPasswordInput }
