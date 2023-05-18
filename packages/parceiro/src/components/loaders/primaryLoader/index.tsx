import React from 'react'
import Loader from 'react-spinners/PulseLoader'

import { Container, Label } from './styles'

interface Props {
  label?: string
}

export const PrimaryLoader: React.FC<Props> = ({ label }) => (
  <Container>
    <Loader color="#4078D1" />
    <Label>{label}</Label>
  </Container>
)
