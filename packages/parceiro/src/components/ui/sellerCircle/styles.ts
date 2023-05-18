import styled from 'styled-components'

interface Props {
  directionRow: boolean
}

export const Container = styled.div<Props>`
  width: 100%;
  display: flex;
  flex-direction: ${props => (props.directionRow ? 'row' : 'column')};
  justify-content: center;
  align-items: center;
`
export const Content = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(250, 177, 160);
  background: linear-gradient(
    180deg,
    rgba(250, 177, 160, 1) 0%,
    rgba(253, 121, 168, 1) 100%
  );

  @media (max-width: 450px) {
    width: 4rem;
    height: 4rem;
  }
`
export const Initials = styled.label`
  font-family: 'Inter';
  font-size: 1.4rem;
  font-weight: 500;
  color: #fff;

  @media (max-width: 450px) {
    font-size: 1.2rem;
  }
`
export const Value = styled.label`
  font-family: 'Inter';
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1.2rem;
  color: ${props => props.theme.colors['slate-600']};

  @media (max-width: 450px) {
    font-size: 0.9rem;
  }
`
export const InfoWrapper = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
`
export const Name = styled(Value)`
  margin-top: 0;
`
export const Label = styled(Value)`
  font-weight: 400;
  margin-top: 0;
`
