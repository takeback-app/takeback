import styled from 'styled-components'

import PALLET from '../../../styles/ColorPallet'

interface Props {
  error?: boolean | string
  fileSelected?: boolean
}

export const Container = styled.div<Props>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: ${PALLET.COLOR_03};
  margin: 0;
  padding: 0;
`
export const Label = styled.label<Props>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Inter';
  color: ${props => (props.fileSelected ? '#009933' : '#414141')};

  :hover {
    cursor: pointer;
  }
`
