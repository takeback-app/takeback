import React from 'react'

import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputRightElement,
  Spinner,
  Textarea,
  TextareaProps
} from '@chakra-ui/react'

interface ChakraTextAreaProps extends TextareaProps {
  isRequired?: boolean
  isLoading?: boolean
  label?: string
  error?: string
  helpText?: string
  children?: React.ReactNode
}

const ChakraTextArea = React.forwardRef<
  HTMLTextAreaElement | HTMLTextAreaElement,
  ChakraTextAreaProps
>(
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
          <Textarea
            autoFocus={rest.autoFocus}
            isReadOnly={isReadOnly}
            ref={ref as React.Ref<HTMLTextAreaElement>}
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

ChakraTextArea.displayName = 'ChakraTextArea'

export { ChakraTextArea }
