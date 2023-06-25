import React, { useMemo, useState } from 'react'
import {
  Avatar,
  AvatarBadge,
  Box,
  Divider,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react'
import { TNotifications } from '../../../types/TNotifications'
import useSWR from 'swr'
import { updateNotification } from '../../../services/notificationApi'
import { chakraToastConfig } from '../../../styles/chakraToastConfig'
import { FaBell } from 'react-icons/fa'

interface Notifications {
  data: TNotifications[]
}

export function NotificationPopoverButton() {
  const [notifications, setNotifications] = useState([] as TNotifications[])

  const toast = useToast(chakraToastConfig)

  async function updateNotificationToRead(id: string) {
    const [isOk, response] = await updateNotification(id, {
      isRead: true
    })

    if (!isOk) {
      return toast({
        title: 'Atenção',
        description: response.message,
        status: 'error'
      })
    }

    setNotifications(state =>
      state.map(function (value) {
        if (value.id === id) {
          value.readAt = new Date().toString()
        }

        return value
      })
    )
  }

  const { data } = useSWR<Notifications>(`/manager/unread-notifications`)

  useMemo(() => {
    if (data !== undefined) {
      setNotifications(data.data)
    }
  }, [data])

  return (
    <Popover arrowSize={12} placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={
            <>
              <Avatar icon={<FaBell />} size="sm" bg="gray.400">
                {!!notifications.filter(item => !item.readAt).length && (
                  <AvatarBadge boxSize="1.25em" bg="blue.500"></AvatarBadge>
                )}
              </Avatar>
            </>
          }
        />
      </PopoverTrigger>
      <PopoverContent minW={{ base: undefined, md: 'lg' }}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontSize={'lg'}>Notificações</PopoverHeader>
        <PopoverBody p={0} maxH="lg" overflowY="auto">
          <Stack spacing={0} bgColor="white" divider={<Divider />}>
            {notifications.length > 0 ? (
              notifications.map(item => (
                <Box
                  cursor="pointer"
                  key={item.id}
                  _hover={{
                    bg: 'twitter.50',
                    transition: 'background ease 0.5s'
                  }}
                  px={4}
                  py={2}
                  onClick={() => updateNotificationToRead(item.id)}
                >
                  <Flex flex="1" justify="space-between" gap="4">
                    <Box>
                      <Text as="b">{item.title}</Text>
                      <Text fontSize="sm">{item.body}</Text>
                    </Box>
                    {
                      <Box
                        bg={!item.readAt ? 'blue.400' : 'transparent'}
                        rounded="full"
                        minW="2"
                        minH="2"
                        alignSelf="center"
                      />
                    }
                  </Flex>
                </Box>
              ))
            ) : (
              <Box
                cursor="pointer"
                _hover={{
                  bg: 'twitter.50',
                  transition: 'background ease 0.5s'
                }}
                px={4}
                py={2}
              >
                <Flex flex="1" justify="space-between" gap="4">
                  <Box>
                    <Text fontSize="sm">
                      Parabéns todas as notificações foram visualizadas!
                    </Text>
                  </Box>
                </Flex>
              </Box>
            )}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
