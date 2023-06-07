import styled from 'styled-components'

import PALLET from '../../../styles/ColorPallet'

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: ${PALLET.COLOR_06};
  cursor: pointer;
  background-color: ${PALLET.COLOR_13};
  border: 1px solid #f2f2f2;
  border-radius: 8px;
  transition: 200ms all;

  :hover {
    -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  }

  @media (max-width: 768px) {
    height: 20vh;
  }
`

export const Icon = styled.div`
  font-size: 3rem;
`
export const TitleCard = styled.h4`
  display: flex;

  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }
`
export const Description = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.7rem;
  font-weight: 400;
  text-transform: capitalize;

  @media (max-width: 1024px) {
    font-size: 0.3rem;
  }
`
export const DescriptionCard = styled.h6`
  color: ${PALLET.COLOR_01};
  font-weight: 400;
`
