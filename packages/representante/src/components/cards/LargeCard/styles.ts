import styled from 'styled-components'

interface Props {
  cardColor?: string
  textColor?: string
}

export const Container = styled.div<Props>`
  width: 99%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  font-family: 'Inter';
  font-size: 0.8rem;
  padding: 0.8rem;
  background-color: ${props => props.cardColor};
  transition: 300ms all;
  border: 1px solid rgba(186, 186, 186, 0.3);
  position: relative;

  -webkit-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.02);
  -moz-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.02);
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.02);

  :hover {
    -webkit-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.05);
    box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.05);
  }
`
export const Header = styled.div<Props>`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: ${props => props.textColor};
`
export const Main = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0 0;
`
export const Title = styled.h5`
  font-size: 0.9em;
  font-weight: 500;
  text-transform: uppercase;
`
export const SubTitle = styled.h6`
  font-size: 1.1em;
  font-weight: 800;
`
