import React from 'react'
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Image,
  BoxProps
} from '@chakra-ui/react'
import Drawer from '../Drawer'

import LogoHorizontal from '../../../assets/branding/logo-horizontal-svg.svg'

interface SidebarProps extends BoxProps {
  onClose: () => void
}

export function SidebarContent({ onClose, ...rest }: SidebarProps) {
  return (
    <Box
      transition="3s ease"
      bg="#3A4D5C"
      borderRight="1px"
      fontSize="14px"
      overflowY="auto"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={LogoHorizontal} w="60" />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Drawer />
    </Box>
  )
}
