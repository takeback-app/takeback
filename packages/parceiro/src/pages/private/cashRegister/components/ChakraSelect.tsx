import React from 'react'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputRightElement,
  Select,
  SelectProps,
  Spinner
} from '@chakra-ui/react'

interface Option {
  value?: string | number
  text: string
}

interface ChakraSelectProps extends SelectProps {
  isRequired?: boolean
  isLoading?: boolean
  label: string
  error?: string
  children?: React.ReactNode

  options: Option[]
}

const ChakraSelect = React.forwardRef<HTMLSelectElement, ChakraSelectProps>(
  (
    {
      label,
      children,
      options,
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
        isRequired={isRequired}
        isReadOnly={rest.isReadOnly}
        isInvalid={!!rest.error}
      >
        <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600">
          {label}
        </FormLabel>
        <InputGroup>
          <Select
            autoFocus={rest.autoFocus}
            isReadOnly={rest.isReadOnly}
            size="sm"
            pointerEvents={isLoading || rest.isReadOnly ? 'none' : 'auto'}
            ref={ref}
            {...rest}
          >
            {options.map(({ text, value }) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </Select>
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

ChakraSelect.displayName = 'ChakraSelect'

export { ChakraSelect }
