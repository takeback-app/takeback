import React, { useContext } from 'react'

import { AuthContext } from '../../../contexts/AuthContext'

import {
  Box,
  BoxProps,
  Drawer,
  DrawerContent,
  useDisclosure
} from '@chakra-ui/react'

import { ContainerNotLogged } from './styles'
import { Nav } from './Nav'
import { SidebarContent } from './SidebarContent'

interface LayoutProps extends BoxProps {
  title?: string
  goBackTitle?: string
  goBack?: () => void
}

export function Layout({ children, title, ...rest }: LayoutProps) {
  const { isSignedIn } = useContext(AuthContext)

  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!isSignedIn) {
    return <ContainerNotLogged>{children}</ContainerNotLogged>
  }

  return (
    <Box minH="100vh" bg="gray.100">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <Nav onOpen={onOpen}>{title}</Nav>
      <Box ml={{ base: 0, md: 60 }} {...rest}>
        {children}
      </Box>
    </Box>
  )
}

export default Layout
