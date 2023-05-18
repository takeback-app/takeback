import styled from 'styled-components'
import { toastTypes } from './index'

interface TastStyleProps {
  type?: toastTypes
}

export const Container = styled.div<TastStyleProps>`
  display: flex;
  flex-direction: column;
  max-width: 350px;
  padding: 0.75rem;
  gap: 0.5rem;
  border-radius: 0.375rem;
  background-color: ${props => {
    switch (props.type) {
      case 'success':
        return props.theme.colors['green-500']
      case 'error':
        return props.theme.colors['red-400']
      case 'warn':
        return props.theme.colors['yellow-400']
      case 'info':
        return props.theme.colors['blue-500']
    }
  }};

  @media (max-width: ${props => props.theme.breakpoints.sm}px) {
    max-width: 100%;
  }
`

export const Title = styled.span`
  display: flex;
  font-size: 1.125rem /* 18px */;
  font-weight: 600;
  font-family: 'Inter';
  line-height: 1.75rem;
  line-height: 1;
  color: ${props => props.theme.colors['white-100']};
`

export const Description = styled.p`
  display: flex;
  font-size: 1rem /* 16px */;
  font-family: 'Inter';
  line-height: 1.5rem /* 24px */;
  color: ${props => props.theme.colors['white-100']};
`
