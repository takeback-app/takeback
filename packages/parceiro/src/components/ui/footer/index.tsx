import React from 'react'

import { Container, DesenCoder, HelpLink } from './styles'

export const Footer: React.FC = () => {
  return (
    <Container>
      <HelpLink to="#">Precisa de ajuda? Clique aqui</HelpLink>
      <DesenCoder href="https://desencoder.com.br" target="_blank">
        Desencoder
      </DesenCoder>
    </Container>
  )
}
