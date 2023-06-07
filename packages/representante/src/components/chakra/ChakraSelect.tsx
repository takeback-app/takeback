import React, { useMemo } from 'react'

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

export interface Option {
  value: string | number
  text: string
}

interface ChakraSelectProps extends SelectProps {
  isRequired?: boolean
  isLoading?: boolean
  label: string
  error?: string
  children?: React.ReactNode
  placeholderOption?: string
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
      error,
      isRequired = false,
      isLoading = false,
      placeholderOption,
      ...rest
    },
    ref
  ) => {
    const allOptions = useMemo<Option[]>(() => {
      if (!placeholderOption) return options

      return [{ value: '', text: placeholderOption }, ...options]
    }, [placeholderOption, options])

    return (
      <FormControl
        gridColumnStart={gridColumnStart}
        gridColumnEnd={gridColumnEnd}
        isRequired={isRequired}
        isReadOnly={rest.isReadOnly}
        isInvalid={!!error}
      >
        <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600">
          {label}
        </FormLabel>
        <InputGroup>
          <Select
            autoFocus={rest.autoFocus}
            isReadOnly={rest.isReadOnly}
            pointerEvents={isLoading || rest.isReadOnly ? 'none' : 'auto'}
            ref={ref}
            {...rest}
          >
            {allOptions.map(({ text, value }) => (
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
        {children}
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    )
  }
)

ChakraSelect.displayName = 'ChakraSelect'

export { ChakraSelect }
