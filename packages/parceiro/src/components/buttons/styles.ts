import styled from 'styled-components'

interface ButtonsProps {
  widthMobile?: 'auto' | 'full'
}

export const ButtonBlue = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 50px;
  border: 0;
  border-radius: 8px;
  padding: 0 32px;

  font-weight: 700;
  font-size: 14px;

  background: ${props => props.theme.colors['blue-500']};
  color: ${props => props.theme.colors['white-100']};

  cursor: pointer;
  transition: 0.2s;

  &:not(:disabled):hover {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const OutlinedButton = styled.button<ButtonsProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;

  width: auto;
  height: 2.6rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 1rem;

  color: ${props => props.color};
  border: 1px solid ${props => props.color}10;
  background: ${props => props.color}40;

  cursor: pointer;
  transition: 0.2s background-color;

  &:hover {
    border: 1px solid ${props => props.color}20;
    background: ${props => props.color}50;
  }

  &:not(:disabled):hover {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}px) {
    width: ${props => (props.widthMobile === 'full' ? '100%' : 'auto')};
  }
`
