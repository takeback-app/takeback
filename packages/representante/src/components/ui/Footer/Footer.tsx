import React from 'react'

import { Container, DesenCoder, HelpLink } from './styles'

const Footer: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <Container>
      <HelpLink to="#">Precisa de ajuda? Clique aqui</HelpLink>
      <DesenCoder href="https://desencoder.com.br" target="_blank">
        Desencoder
      </DesenCoder>
    </Container>
  )
}

export default Footer
