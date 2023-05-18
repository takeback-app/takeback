import React, { useEffect, useState } from 'react'
import { Box, Button, Center, Modal, Spinner, Text } from 'native-base'

import useSWR from 'swr'
import { useCompanies } from '../../../../../stores/useCompanies'
import { Select } from '../../../../../components/Select'

type City = {
  id: number
  name: string
}

type Industry = {
  id: number
  description: string
}

interface FilterDataResponse {
  cities: City[]
  industries: Industry[]
}

interface FilterComponentProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterComponent({ isOpen, onClose }: FilterComponentProps) {
  const [cityName, setCityName] = useState<string | null>(null)
  const [industryDescription, setIndustryDescription] = useState<string | null>(
    null
  )

  const { selectedCityName, selectedIndustryDescription, filter } =
    useCompanies()

  const { data, isLoading } = useSWR<FilterDataResponse>(
    'costumer/companies/find/filters'
  )

  useEffect(() => {
    setCityName(selectedCityName)

    setIndustryDescription(selectedIndustryDescription)
  }, [selectedCityName, selectedIndustryDescription])

  return (
    <Modal isOpen={isOpen} onClose={onClose} px="4">
      <Modal.Content w="full" rounded="2xl">
        <Modal.CloseButton />
        <Modal.Header>
          <Text fontWeight="semibold" fontSize="md" color="gray.800">
            Filtros
          </Text>
        </Modal.Header>
        {isLoading ? (
          <Center h="full">
            <Spinner color="blue.400" size="lg" />
            <Text fontWeight="medium" fontSize="md" color="blue.400">
              Carregando filtros...
            </Text>
          </Center>
        ) : (
          <>
            <Modal.Body>
              <Text fontWeight="medium" fontSize="md" color="gray.800" mb={1}>
                Cidade
              </Text>
              <Box w="full">
                <Select
                  placeholder="Selecione uma cidade"
                  onValueChange={setCityName}
                  value={cityName}
                  items={
                    data?.cities.map(({ name }) => ({
                      label: name,
                      value: name
                    })) ?? []
                  }
                />
              </Box>

              <Text
                fontWeight="medium"
                fontSize="md"
                color="gray.800"
                mt="4"
                mb={1}
              >
                Ramo de atividade
              </Text>
              <Box w="full">
                <Select
                  placeholder="Selecione um ramo"
                  onValueChange={setIndustryDescription}
                  value={industryDescription}
                  items={
                    data?.industries.map(({ description }) => ({
                      label: description,
                      value: description
                    })) ?? []
                  }
                />
              </Box>
            </Modal.Body>
            <Modal.Footer borderTopWidth={0}>
              <Button
                h="12"
                w="full"
                rounded="full"
                bgColor="blue.600"
                _pressed={{
                  bgColor: 'blue.400'
                }}
                _text={{
                  fontSize: 'md',
                  fontWeight: 'medium'
                }}
                isLoading={isLoading}
                onPress={() => {
                  useCompanies.setState({
                    selectedCityName: cityName,
                    selectedIndustryDescription: industryDescription
                  })
                  filter()
                  onClose()
                }}
              >
                Aplicar filtros
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal>
  )
}
