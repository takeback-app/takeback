import React from 'react'

import { Flex, FlexProps } from '@chakra-ui/react'

const AutocompleteItem = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ children, ...rest }) => {
    return (
      <Flex
        minH={8}
        fontSize="sm"
        align="center"
        px={3}
        color="gray.800"
        lineHeight="10"
        _hover={{
          bg: 'gray.100',
          cursor: 'pointer',
          transitionDuration: '0.2s',
          transitionTimingFunction: 'ease-in-out'
        }}
        {...rest}
      >
        {children}
      </Flex>
    )
  }
)

AutocompleteItem.displayName = 'AutocompleteItem'

export { AutocompleteItem }
