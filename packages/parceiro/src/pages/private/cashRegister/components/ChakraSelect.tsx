import React from 'react'

import {
  FormControl,
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
      >
        <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600">
          {label}
        </FormLabel>
        <InputGroup variant="flushed">
          <Select
            fontWeight="black"
            fontSize="sm"
            size="xs"
            variant="flushed"
            autoFocus={rest.autoFocus}
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
        {children}
      </FormControl>
    )
  }
)

ChakraSelect.displayName = 'ChakraSelect'

export { ChakraSelect }
