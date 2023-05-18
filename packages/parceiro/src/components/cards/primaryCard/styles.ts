import styled from 'styled-components'

interface Props {
  color?: string
}

export const Container = styled.div<Props>`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 120px;
  padding: 5px;
  border: 1px solid ${props => props.color}50;
  border-radius: 4px;
  background-color: ${props => props.color}60;
  position: relative;
  transition: 200ms all;
  cursor: pointer;

  :hover {
    border: 1px solid ${props => props.color};
  }

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }
`
export const IconWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
`
export const Title = styled.h4`
  z-index: 1;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
`
