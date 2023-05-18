import React from 'react'
import styled from 'styled-components'

import Loader from 'react-spinners/BarLoader'

const Container = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eff3f5;
`

export const LoadingPage: React.FC = () => (
  <Container>
    <Loader loading={true} color="#1884E3" />
  </Container>
)
