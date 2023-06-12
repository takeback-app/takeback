import React from 'react'

import {
  Alert,
  CloseIcon,
  HStack,
  IconButton,
  Text,
  VStack,
  IAlertProps
} from 'native-base'

interface ToastAlertProps extends IAlertProps {
  status?: 'info' | 'warning' | 'success' | 'error'
  variant?: 'solid' | 'subtle' | 'left-accent' | 'top-accent' | 'outline'
  title?: string
  description?: string
  isClosable?: boolean
  onClosablePress?: () => void
}

export function ToastAlert({
  status,
  variant,
  title,
  description,
  isClosable,
  onClosablePress,
  ...rest
}: ToastAlertProps) {
  return (
    <Alert
      mx="4"
      maxWidth="100%"
      alignSelf="center"
      flexDirection="row"
      status={status ? status : 'info'}
      variant={variant}
      {...rest}
    >
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
              color={
                variant === 'solid'
                  ? 'lightText'
                  : variant !== 'outline'
                  ? 'darkText'
                  : null
              }
            >
              {title}
            </Text>
          </HStack>
          {isClosable ? (
            <IconButton
              variant="unstyled"
              icon={<CloseIcon size="3" />}
              _icon={{
                color: variant === 'solid' ? 'lightText' : 'darkText'
              }}
              onPress={onClosablePress}
            />
          ) : null}
        </HStack>
        <Text
          px="6"
          color={
            variant === 'solid'
              ? 'lightText'
              : variant !== 'outline'
              ? 'darkText'
              : null
          }
        >
          {description}
        </Text>
      </VStack>
    </Alert>
  )
}
