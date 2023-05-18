import React from 'react'

import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
  helpText?: string
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
      isReadOnly,
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
        isReadOnly={isReadOnly}
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
            isReadOnly={isReadOnly}
            ref={ref}
            {...rest}
          />
          {isLoading ? (
            <InputRightElement pointerEvents="none" color="gray.300">
              <Spinner size="xs" mb={6} />
            </InputRightElement>
          ) : null}
        </InputGroup>
        {rest.helpText ? (
          <FormHelperText>{rest.helpText}</FormHelperText>
        ) : null}
        <FormErrorMessage>{rest.error}</FormErrorMessage>
        {children}
      </FormControl>
    )
  }
)

ChakraInput.displayName = 'ChakraInput'

export { ChakraInput }
