import styled from 'styled-components'

export const Container = styled.main`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    height: 92vh;
    overflow: scroll;
  }
`
export const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-transform: uppercase;
  font-size: 1rem;
  text-align: center;
  color: ${props => props.theme.colors['gray-700']};
  gap: 5px;

  @media (max-width: 450px) {
    flex-direction: row-reverse;
  }
`

export const SmallCardsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 450px) {
    grid-template-columns: repeat(1, 1fr);
  }
`
export const LargeCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  width: 100%;
  height: 80%;
  min-height: 63vh;
  gap: 6px;

  @media (max-width: 1024px) {
    min-height: 40vh;
  }
  @media (max-width: 768px) {
    height: 100%;
    grid-template-columns: 1fr;
    gap: 1rem;
    min-height: 50vh;
  }
`
export const Title = styled.h6`
  font-size: 0.9rem;
  line-height: 0.9rem;
`
export const ContainLoader = styled(Container)`
  justify-content: center;
  align-items: center;
`
export const NoDataLabel = styled.h6`
  color: #a6a6a6;
  font-weight: 400;
  font-size: 0.9rem;
`
export const FooterDevelopment = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
`
export const DevelopmentFont = styled.a`
  font-family: 'inter';
  text-decoration: none;
  font-style: italic;
  color: #3a4d5c;
`
