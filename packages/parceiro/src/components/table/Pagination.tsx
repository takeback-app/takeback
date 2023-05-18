import React from 'react'

import { Box, Button, ButtonGroup } from '@chakra-ui/react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

interface PaginationProps {
  page: number
  lastPage: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}

export function Pagination({ page, lastPage, setPage }: PaginationProps) {
  return (
    <Box mt={4}>
      <ButtonGroup size="sm">
        <Button
          isDisabled={page === 1}
          onClick={() => setPage(state => state - 1)}
          leftIcon={<IoChevronBack />}
        >
          Anterior
        </Button>
        <Button
          onClick={() => setPage(state => state + 1)}
          isDisabled={lastPage === page}
          rightIcon={<IoChevronForward />}
        >
          Próximo
        </Button>
      </ButtonGroup>
    </Box>
  )
}
