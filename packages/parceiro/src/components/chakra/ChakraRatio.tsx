import React from 'react'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  RadioGroupProps,
  RadioGroup,
  Stack
} from '@chakra-ui/react'

interface ChakraRadioProps extends RadioGroupProps {
  isRequired?: boolean
  isReadOnly?: boolean
  direction?: 'row' | 'column'
  label?: string
  error?: string
  children: React.ReactNode
}

const ChakraRadio = React.forwardRef<HTMLInputElement, ChakraRadioProps>(
  (
    {
      label,
      children,
      display,
      gridColumnStart,
      gridColumnEnd,
      direction = 'row',
      isRequired = false,
      isReadOnly = false,
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

        <RadioGroup ref={ref} {...rest}>
          <Stack direction={direction}>{children}</Stack>
        </RadioGroup>
        <FormErrorMessage>{rest.error}</FormErrorMessage>
      </FormControl>
    )
  }
)

ChakraRadio.displayName = 'ChakraRadio'

export { ChakraRadio }
