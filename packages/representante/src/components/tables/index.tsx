import React from 'react'

import {
  Flex,
  Heading,
  Table,
  TableContainer,
  TableContainerProps
} from '@chakra-ui/react'

interface AppTableProps extends TableContainerProps {
  dataLength?: number
  noDataMessage?: string
  pagination?: React.ReactNode
}

export function AppTable({
  children,
  dataLength,
  noDataMessage,
  pagination,
  ...rest
}: AppTableProps) {
  if (dataLength === 0) {
    return (
      <Flex w="full" align="center" justify="center" h="50vh">
        <Heading size="sm" color="gray.500">
          {noDataMessage}
        </Heading>
      </Flex>
    )
  }

  return (
    <TableContainer
      display="flex"
      flexDir="column"
      bg="white"
      p={4}
      rounded="lg"
      {...rest}
    >
      <Table size="sm" mb={0} variant="simple">
        {children}
      </Table>
      {pagination}
    </TableContainer>
  )
}
