import React from 'react'
import styled from 'styled-components'

interface Props {
  color?: string
}

const Loading = styled.div<Props>`
  border: 3px solid ${props => props.color}; /* Light grey */
  border-top: 3px solid transparent; /* Blue */
  border-radius: 50%;
  align-self: center;
  align-items: center;
  width: 1.3rem;
  height: 1.3rem;
  animation: spin 500ms linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const Loader: React.FC<React.PropsWithChildren<Props>> = ({ color }) => (
  <Loading color={color} />
)

export default Loader
