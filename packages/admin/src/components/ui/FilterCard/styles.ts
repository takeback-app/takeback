import styled from 'styled-components'

import PALLET from '../../../styles/ColorPallet'

export const Container = styled.div`
  width: 100%;
  height: 25vh;
  display: flex;
  color: ${PALLET.COLOR_06};
  cursor: pointer;
  background-color: ${PALLET.COLOR_13};
  border-radius: 8px;
  -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);

  @media (max-width: 900px) {
    height: 30vh;
  }
  @media (max-width: 768px) {
    height: 53vh;
  }
`

export const Content = styled.div`
  width: 100%;
  padding: 1rem;
  align-items: center;
  justify-content: center;
`
export const Main = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
