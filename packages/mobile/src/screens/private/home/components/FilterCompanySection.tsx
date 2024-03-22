import React from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  IButtonProps,
  Icon,
  Stack,
  Text
} from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { ScrollView, TouchableOpacity, Text as NativeText } from 'react-native'
import { useCompanies } from '../../../../stores/useCompanies'
import { NewTag } from '../../../../components/NewTag'

interface FilterCompanySectionProps {
  text: string
  onPress(): void
}

interface FilterItemProps extends IButtonProps {
  text: string
  value: string
  onPress(): void
}

function FilterItem({ text, value, ...rest }: FilterItemProps) {
  return (
    <Button
      px={2}
      py={1}
      borderRadius="full"
      bg="blueGray.400"
      _pressed={{ bgColor: 'blueGray.500' }}
      endIcon={<Ionicons name="close" size={14} color="white" />}
      {...rest}
    >
      <Flex flexDir="row">
        <Text color="white" lineHeight="sm" fontWeight="medium">
          {text}:&nbsp;
        </Text>
        <Text color="white" maxW={125} noOfLines={1} lineHeight="sm">
          {value}
        </Text>
      </Flex>
    </Button>
  )
}

export function FilterCompanySection({
  text,
  onPress
}: FilterCompanySectionProps) {
  const { selectedCityName, selectedIndustryDescription, filter } =
    useCompanies()

  return (
    <Box bg="gray.300">
      <Stack
        bg="white"
        p="4"
        roundedTop="3xl"
        borderBottomColor="gray.300"
        borderBottomWidth={2}
      >
        <Flex flexDir="row" align="center" justify="space-between">
          <Text fontSize="md" fontWeight="semibold" color="blue.600">
            {text}
          </Text>
          <TouchableOpacity onPress={onPress}>
            <Icon as={Ionicons} name="filter" size="lg" color="blue.600" />
          </TouchableOpacity>
        </Flex>

        {selectedCityName || selectedIndustryDescription ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
          >
            <HStack space={2} mt={4}>
              {selectedCityName ? (
                <FilterItem
                  text="Cidade"
                  value={selectedCityName}
                  onPress={() => {
                    useCompanies.setState({ selectedCityName: null })
                    filter()
                  }}
                />
              ) : null}

              {selectedIndustryDescription ? (
                <FilterItem
                  text="Ramo"
                  value={selectedIndustryDescription}
                  onPress={() => {
                    useCompanies.setState({
                      selectedIndustryDescription: null
                    })
                    filter()
                  }}
                />
              ) : null}
            </HStack>
          </ScrollView>
        ) : null}

        <Flex align="flex-end" flexDir="row">
          <NativeText allowFontScaling={false} style={{ marginTop: 8 }}>
            <Text fontSize="13px" fontWeight="bold">
              Clique na empresa para solicitar cashback 👇
            </Text>
          </NativeText>
        </Flex>
      </Stack>
    </Box>
  )
}
