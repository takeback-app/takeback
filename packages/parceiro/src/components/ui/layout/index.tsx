import React, { ReactNode, useContext } from 'react'

import { AuthContext } from '../../../contexts/AuthContext'

import { Box, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react'
import { Nav } from './Nav'
import { SidebarContent } from './SidebarContent'

import * as S from './styles'

interface Props {
  title?: string
  children: ReactNode
}

export const Layout: React.FC<Props> = ({ children, title }) => {
  const { isSignedIn } = useContext(AuthContext)
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!isSignedIn) {
    return <S.ContainerNotLogged>{children}</S.ContainerNotLogged>
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
      <Box ml={{ base: 0, md: 60 }}>{children}</Box>
    </Box>
  )
}
