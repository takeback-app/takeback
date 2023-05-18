import React, { useCallback, useState } from 'react'
import { Box, Card } from '@chakra-ui/react'

import { useCombobox } from 'downshift'

import _debounce from 'lodash/debounce'

import { API } from '../../../../services/API'
import { maskCPF, unMaskCpf } from '../../../../utils/masks'
import { useCashRegisterState } from '../state'
import { ChakraInput } from './ChakraInput'
import { Control, Controller } from 'react-hook-form'
import { CashRegisterData } from '..'
import { toast } from '../../../../components/ui/toast'
import { AutocompleteItem } from './AutocompleteItem'

interface AutocompleteInputCpfProps {
  control: Control<CashRegisterData>
  selectConsumerItem: (item: string) => void
}

export function AutocompleteInputCpf({
  control,
  selectConsumerItem
}: AutocompleteInputCpfProps) {
  const { setConsumerName } = useCashRegisterState()

  const [isLoading, setIsLoading] = useState(false)
  const [autocompleteItems, setAutocompleteItems] = useState<string[]>([])

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    items: autocompleteItems,
    itemToString: item => {
      selectConsumerItem(item ?? '')

      return maskCPF(item ?? '')
    }
  })

  // eslint-disable-next-line
  const debouncedChangeHandler = useCallback(_debounce(changeHandler, 1000), [])

  async function changeHandler(maskedCpf: string) {
    const actualCpf = unMaskCpf(maskedCpf)

    if (actualCpf.length < 3 || actualCpf.length >= 11) {
      return setAutocompleteItems([])
    }

    setIsLoading(true)

    try {
      const response = await API.get(
        `company/cashback/costumer/autocomplete/${actualCpf}`
      )

      setAutocompleteItems(response.data)
    } catch {
      toast({
        title: 'Houve um erro interno',
        description: 'Procure um administrador',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleChangeCpf(initialCpf: string) {
    const maskedCpf = maskCPF(initialCpf)

    if (maskedCpf.length < 14) setConsumerName('')

    debouncedChangeHandler(maskedCpf)

    return maskedCpf
  }

  return (
    <Controller
      control={control}
      name="cpf"
      defaultValue=""
      render={({
        field: { onChange, ref, value, name, onBlur },
        fieldState
      }) => (
        <ChakraInput
          isRequired
          label="CPF"
          autoFocus
          autoComplete="off"
          borderColor="gray.500"
          name={name}
          onBlur={onBlur}
          error={fieldState.error?.message}
          onPaste={() => setConsumerName('')}
          isLoading={isLoading}
          {...getInputProps({
            ref,
            value,
            onChange: e => {
              e.currentTarget.value = handleChangeCpf(e.currentTarget.value)

              onChange(e)
            }
          })}
        >
          <Box
            display={
              !isOpen || !autocompleteItems.length || value.length >= 14
                ? 'none'
                : undefined
            }
            position="relative"
            {...getMenuProps()}
          >
            <Card
              zIndex="docked"
              bg="white"
              w="full"
              overflowY="auto"
              maxH={40}
              top={1}
              position="absolute"
            >
              {isOpen &&
                autocompleteItems.map((item, index) => (
                  <AutocompleteItem
                    key={index}
                    __css={{
                      bg: highlightedIndex === index ? 'gray.100' : undefined
                    }}
                    {...getItemProps({ item, index })}
                  >
                    {item}
                  </AutocompleteItem>
                ))}
            </Card>
          </Box>
        </ChakraInput>
      )}
    />
  )
}
