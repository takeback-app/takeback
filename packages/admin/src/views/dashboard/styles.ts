import styled from 'styled-components'

export const Container = styled.main`
  width: 100%;
  height: 92vh;
  padding: 0.5rem;
  overflow: scroll;
`
export const SmallCardsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  grid-template-columns: 2fr 1fr;
  width: 100%;
  height: 80%;
  margin-top: 15px;

  @media (max-width: 768px) {
    height: 100%;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`
export const LargeCardsWrapper2 = styled(LargeCardsWrapper)`
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 450px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
  }
`
