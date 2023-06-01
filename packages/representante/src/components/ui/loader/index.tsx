import React from 'react'
import styled from 'styled-components'

interface LoadingProps {
  color?: string
}

const Loading = styled.div<LoadingProps>`
  border: 3px solid ${props => props.color}; /* Light grey */
  border-top: 3px solid transparent; /* Blue */
  border-radius: 50%;
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

interface Props {
  color?: string
}

export const Loader: React.FC<Props> = ({ color = '#fff' }) => (
  <Loading color={color} />
)
