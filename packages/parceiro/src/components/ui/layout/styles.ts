import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.colors['white-300']};
`
export const ContainerNotLogged = styled(Container)`
  display: block;
`
