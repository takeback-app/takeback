import {
  Alert,
  Box,
  CloseIcon,
  HStack,
  IconButton,
  VStack,
  Text,
  Collapse
} from 'native-base'
import React from 'react'

interface AlertComponentProps {
  showAlert?: boolean
  closeAlert?: () => void
  title?: string
  message?: string
  status:
    | (string & Record<string, unknown>)
    | 'error'
    | 'success'
    | 'warning'
    | 'info'
    | undefined
}

export function AlertComponent(props: AlertComponentProps) {
  return (
    <Box w="100%">
      <Collapse isOpen={props.showAlert}>
        <Alert
          w="full"
          status={props.status}
          display={props.showAlert ? 'flex' : 'none'}
        >
          <VStack space={1} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <Text
                  fontSize="md"
                  fontWeight="semibold"
                  _dark={{
                    color: 'coolGray.800'
                  }}
                >
                  {props?.title || 'Erro'}
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                _focus={{
                  borderWidth: 0
                }}
                icon={<CloseIcon size="3" />}
                _icon={{
                  color: 'coolGray.600'
                }}
                onPress={props.closeAlert}
              />
            </HStack>
            {props?.message && (
              <Box
                pl="6"
                _dark={{
                  _text: {
                    color: 'coolGray.600',
                    fontWeight: 'semibold'
                  }
                }}
                _text={{
                  fontWeight: 'medium'
                }}
              >
                {props?.message}
              </Box>
            )}
          </VStack>
        </Alert>
      </Collapse>
    </Box>
  )
}
