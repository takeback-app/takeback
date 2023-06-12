import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: row;
  background-color: ${PALLET.BACKGROUND};
`
export const ContainerNotLogged = styled(Container)`
  display: block;
`
export const Content = styled.main`
  width: 100%;
  height: 100%;
`
export const Main = styled.main`
  width: 100%;
  height: 92vh;
  /* overflow-y: scroll; */
`
