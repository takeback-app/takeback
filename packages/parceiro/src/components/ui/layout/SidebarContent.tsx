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
import { managerNav } from '../drawer/managerNav'
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
  accessChecker?: {
    checkAccessClientReport: boolean
  }
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

export function SidebarContent({ onClose, ...rest }: SidebarProps) {
  const { isManager, canAccessClientReport } = useContext(AuthContext)

  const navData = isManager ? managerNav : cashierNav

  const navDataFiltred = navData.filter(data => {
    if (data.accessChecker?.checkAccessClientReport && !canAccessClientReport) {
      return false
    }
    if (!canAccessClientReport && data.pages?.length) {
      console.log(canAccessClientReport)
      data.pages = data.pages.filter(
        page => !page.accessChecker?.checkAccessClientReport
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
