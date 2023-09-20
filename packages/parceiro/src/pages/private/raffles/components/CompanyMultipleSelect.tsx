import React from 'react'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputRightElement,
  SelectProps,
  Spinner
} from '@chakra-ui/react'
import { Select, GroupBase } from 'chakra-react-select'
import useSWR from 'swr'

export interface Option {
  label: string | number | GroupBase<string | number>
  value: string | number | GroupBase<string | number>
}

interface ChakraSelectProps extends SelectProps {
  isRequired?: boolean
  isLoading?: boolean
  label: string
  error?: string
  size?: 'md' | 'lg' | 'sm'
  children?: React.ReactNode
  selectedOptions: Option[]
  setSelectedOptions: React.Dispatch<React.SetStateAction<Option[]>>
}

interface Data {
  id: string
  fantasyName: string
}

const CompanyMultipleSelect = React.forwardRef<never, ChakraSelectProps>(
  (
    {
      label,
      error,
      isRequired = false,
      size,
      selectedOptions,
      setSelectedOptions,
      ...rest
    },
    ref
  ) => {
    const { data, isLoading } = useSWR<Data[]>(['company/find/city/companies'])

    return (
      <FormControl
        isRequired={isRequired}
        isReadOnly={rest.isReadOnly}
        isInvalid={!!error}
        style={{
          position: 'relative',
          zIndex: '100',
          width: '100%'
        }}
      >
        <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600">
          {label}
        </FormLabel>
        <InputGroup>
          <div style={{ width: '100%' }}>
            <Select
              size={size}
              isMulti
              options={data?.map(company => ({
                label: company.fantasyName,
                value: company.id
              }))}
              autoFocus={rest.autoFocus}
              isReadOnly={rest.isReadOnly}
              value={selectedOptions}
              placeholder="Selecione as empresas"
              onChange={e => setSelectedOptions(e as Option[])}
              ref={ref}
            />
          </div>
          {isLoading ? (
            <InputRightElement pointerEvents="none" color="gray.300">
              <Spinner size="xs" mb={6} />
            </InputRightElement>
          ) : null}
        </InputGroup>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    )
  }
)

CompanyMultipleSelect.displayName = 'CompanyMultipleSelect'

export { CompanyMultipleSelect }
