import styled from 'styled-components'

interface Props {
  color?: string
  onClick?: () => void
}

export const Container = styled.div<Props>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  border-radius: 6px;
  padding: 0.7rem;
  background-color: ${props => props.color}50;
  font-family: 'Inter';
  transition: 300ms all;
  border: 1px solid rgba(186, 186, 186, 0.3);
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};

  -webkit-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.02);
  -moz-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.02);
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.02);

  :hover {
    -webkit-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.05);
    box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 450px) {
    width: 100%;
    justify-content: flex-start;
    gap: 20px;
  }
`

export const Title = styled.h1`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #3a4d5c;
  letter-spacing: 0.6px;

  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }

  @media (max-width: 450px) {
    font-size: 0.8rem;
  }
`
export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: none;
  }
  @media (max-width: 450px) {
    display: flex;
  }
`
