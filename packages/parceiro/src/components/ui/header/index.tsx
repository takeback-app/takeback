import React, { useContext, useState } from 'react'

import { DrawerContext } from '../../../contexts/DrawerContext'
import useSWR from 'swr'

import { DropMenu } from '../dropMenu'

import * as Styles from './styles'
import { Flex, Text, Tooltip } from '@chakra-ui/react'

interface Props {
  title?: string
  gobackTitle?: string
  goBack?: () => void
}

interface StatusData {
  hasWarning: boolean
  message: string
}

function WarningMessage({ message }: { message: string }) {
  if (!message) return null

  return (
    <Flex
      maxW={{ base: 32, md: 64, lg: 96 }}
      mr={4}
      bg="red.500"
      borderRadius="md"
      p={2}
    >
      <Tooltip label={message} textAlign="center" marginTop="1">
        <Text
          noOfLines={2}
          color="white"
          align="center"
          fontWeight="semibold"
          fontSize="xs"
        >
          {message}
        </Text>
      </Tooltip>
    </Flex>
  )
}

export const Header: React.FC<Props> = props => {
  const [warningMessage, setWarningMessage] = useState('')
  const { isOpen, setIsOpen } = useContext(DrawerContext)

  useSWR('company/status', { onSuccess })

  function onSuccess({ hasWarning, message }: StatusData) {
    if (hasWarning) setWarningMessage(message)
  }

  return (
    <Styles.Container>
      <Styles.Content>
        {props.goBack ? (
          <Styles.MenuBack onClick={props.goBack}>
            <Styles.ArrowBack />
            <Styles.Title>{props.gobackTitle}</Styles.Title>
          </Styles.MenuBack>
        ) : (
          <Styles.MenuIcon onClick={() => setIsOpen(!isOpen)} />
        )}

        {props.title && <Styles.Title>{props.title}</Styles.Title>}
      </Styles.Content>

      <Styles.RightItems>
        <WarningMessage message={warningMessage} />
        <DropMenu />
      </Styles.RightItems>
    </Styles.Container>
  )
}
