import styled from 'styled-components'

interface Props {
  color?: string
  onClick?: () => void
}

export const Container = styled.div<Props>`
  display: flex;
  flex-direction: column;
  gap: 1.6em;
  width: 99%;
  border-radius: 6px;
  padding: 0.8rem;
  background-color: #fff;
  font-family: 'Inter';
  font-size: 0.8rem;
  transition: 300ms all;
  border: 1px solid rgba(186, 186, 186, 0.3);

  -webkit-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.02);
  -moz-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.02);
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.02);

  :hover {
    -webkit-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.05);
    box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.05);
  }
`
export const ContainerLoader = styled(Container)`
  justify-content: center;
  align-items: center;
  min-height: 120px;
`
export const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 3;
  gap: 4px;
  width: 100%;
  height: 100%;
`
export const RightWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  width: 100%;
  height: 100%;
`
export const TopWrapper = styled.div`
  display: flex;
  flex: 2;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const IconWrapper = styled.div<Props>`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${props => props.color}50;
  color: #fff;
  font-size: 2rem;

  -webkit-box-shadow: 2px 4px 8px 2px rgba(0, 0, 0, 0.08);
  -moz-box-shadow: 2px 4px 8px 2px rgba(0, 0, 0, 0.08);
  box-shadow: 2px 4px 8px 2px rgba(0, 0, 0, 0.08);
`
export const Title = styled.h1`
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.6px;
`
export const Description = styled.h6`
  font-size: 1.5rem;
  color: #3a4d5c;
`

export const Label = styled.h6`
  color: #94a3b8;
  font-weight: 400;
  font-size: 0.65rem;
`
export const BottomWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 5px;
  padding: 0.5rem 0 0 0;
  border-top: 1px solid #e0e5eb;
`
