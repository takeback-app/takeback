import React, { useContext } from 'react'
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Image,
  BoxProps
} from '@chakra-ui/react'
import { Drawer, Page } from '../drawer'

import logoHorizontal from '../../../assets/logos/logoTakebackHorizontal.png'
import { AuthContext } from '../../../contexts/AuthContext'
import { AccessControlTypes, managerNav } from '../drawer/managerNav'
import { cashierNav } from '../drawer/cashierrNav'
import { IconType } from 'react-icons'

export interface Nav {
  id: number
  inactiveIcon: IconType
  activeIcon: IconType
  label: string
  isActive: boolean
  to: string
  hasDotKey?: string
  pages?: Page[]
  isOpened?: boolean
  accessChecker: AccessControlTypes
}
interface SidebarProps extends BoxProps {
  onClose: () => void
}

export function SidebarContent({ onClose, ...rest }: SidebarProps) {
  const { isManager, accessControl } = useContext(AuthContext)

  const navData = isManager ? managerNav : cashierNav

  function hasMatchingAccess(item: Nav) {
    if (item.accessChecker.length === 0) {
      return true
    }
    return item.accessChecker.some(accessItem =>
      accessControl.includes(accessItem)
    )
  }

  const navDataFiltred = navData.filter(navItem => {
    if (!hasMatchingAccess(navItem)) {
      return false
    }
    if (navItem.pages && navItem.pages.length > 0) {
      navItem.pages = navItem.pages.filter(pageItem =>
        hasMatchingAccess(pageItem)
      )
    }
    return true
  })

  return (
    <Box
      transition="3s ease"
      bg="#0984E3"
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
        <Image src={logoHorizontal} w="60" />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Drawer navData={navDataFiltred} />
    </Box>
  )
}
