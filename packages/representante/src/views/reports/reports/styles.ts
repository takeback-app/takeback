import styled from 'styled-components'

interface Props {
  color?: string
}

export const Container = styled.div``
export const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 0.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 450px) {
    display: flex;
    flex-direction: column;
  }
`
export const Card = styled.div<Props>`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 120px;
  padding: 5px;
  border-radius: 4px;
  background-color: #3a4d5c;
  position: relative;
  transition: 200ms all;
  cursor: pointer;

  :hover {
    opacity: 0.9;
  }

  @media (max-width: 450px) {
    padding: 2rem;
  }
`
export const CardIconWrapper = styled.div`
  position: absolute;
  left: 5px;
  top: 5px;
`
export const CardTitle = styled.h4`
  z-index: 1;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
`
