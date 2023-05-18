import React from 'react'
import Lottie from 'react-lottie'
import { useTheme } from 'styled-components'

import { OutlinedButton } from '../../buttons'
import animationData from '../../../assets/confirm.json'

import { Container, Content, Message, Title, Main } from './styles'

interface Props {
  visible?: boolean
  title?: string
  message?: string
  onClose: () => void
}

export const PrimaryAlert: React.FC<Props> = ({
  visible,
  title,
  message,
  onClose
}) => {
  const theme = useTheme()

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  return (
    <Container visible={visible}>
      <Content>
        <Lottie
          options={defaultOptions}
          height={200}
          width={200}
          isStopped={!visible}
          isPaused={false}
          isClickToPauseDisabled
        />
        <Main>
          <Title>{title}</Title>
          <Message>{message}</Message>
        </Main>
        <OutlinedButton
          onClick={onClose}
          type="button"
          color={theme.colors['blue-600']}
        >
          <span>Concluir</span>
        </OutlinedButton>
      </Content>
    </Container>
  )
}
