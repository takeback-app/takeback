import React from 'react'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Spinner
} from '@chakra-ui/react'

interface ChakraInputProps extends InputProps {
  isRequired?: boolean
  isLoading?: boolean
  label?: string
  error?: string
  children?: React.ReactNode
}

const ChakraInput = React.forwardRef<HTMLInputElement, ChakraInputProps>(
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
          <Input autoFocus={rest.autoFocus} ref={ref} {...rest} />
          {isLoading ? (
            <InputRightElement pointerEvents="none" color="gray.300">
              <Spinner size="xs" mb={6} />
            </InputRightElement>
          ) : null}
        </InputGroup>
        <FormErrorMessage>{rest.error}</FormErrorMessage>
        {children}
      </FormControl>
    )
  }
)

ChakraInput.displayName = 'ChakraInput'

export { ChakraInput }
