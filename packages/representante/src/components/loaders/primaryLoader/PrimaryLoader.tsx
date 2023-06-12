import React from 'react'
import Loader from 'react-spinners/PulseLoader'

import { Container, Label } from './styles'

interface Props {
  label?: string
}

const PrimaryLoader: React.FC<React.PropsWithChildren<Props>> = ({ label }) => (
  <Container>
    <Loader color="#4078D1" />
    <Label>{label}</Label>
  </Container>
)

export default PrimaryLoader
