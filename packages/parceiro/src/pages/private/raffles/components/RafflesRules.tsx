import React from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Stack,
  Text
} from '@chakra-ui/react'
import data from './rules.json'

export function RafflesRules() {
  return (
    <Card>
      <CardHeader
        as={Flex}
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
      >
        <Heading fontSize="md">Disposições gerais sobre o sorteio</Heading>
      </CardHeader>
      <Divider borderColor="gray.300" />
      <CardBody as={Stack} overflowX="auto" maxH="full">
        {data.rules.map(rule => (
          <Text key={rule} fontSize="sm" color="gray.700">
            {rule}
          </Text>
        ))}
      </CardBody>
    </Card>
  )
}
