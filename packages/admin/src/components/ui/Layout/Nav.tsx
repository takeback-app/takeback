import React, { useContext } from 'react'
import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList
} from '@chakra-ui/react'
import { FiMenu, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router'

import { AuthContext } from '../../../contexts/AuthContext'
import { NotificationPopoverButton } from './NotificationPopoverButton'

interface MobileProps extends FlexProps {
  onOpen: () => void
}

export function Nav({ onOpen, children, ...rest }: MobileProps) {
  const { userName, setIsSignedIn } = useContext(AuthContext)
  const navigateTo = useNavigate()

  const handleLogout = () => {
    setIsSignedIn(false)
    localStorage.clear()
    sessionStorage.clear()
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text display="flex" fontSize="lg" fontWeight="semibold">
        {children}
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <NotificationPopoverButton />

        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar size={'sm'} bg="gray.400" name={userName} />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm" noOfLines={1} maxW={36} textAlign="start">
                    {userName.split(' ').slice(0, 3).join(' ')}
                  </Text>
                  <Text
                    fontSize="xs"
                    noOfLines={1}
                    maxW={36}
                    textAlign="start"
                    color="gray.600"
                  >
                    Takeback
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem
                icon={<FiUser />}
                onClick={() => navigateTo('/configuracoes/perfil')}
              >
                Meu Usuário
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}
