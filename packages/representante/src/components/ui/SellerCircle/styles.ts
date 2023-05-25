import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

export const Container = styled.div`
  width: 100%;
  display: flex;
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

  @media (max-width: 1024px) {
    display: none;
  }
`
export const Initials = styled.label`
  font-family: 'Inter';
  font-size: 1.4rem;
  font-weight: 500;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`
export const InfoWrapper = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  font-family: inter;
  color: ${PALLET.COLOR_01};
`
export const Name = styled.div`
  font-weight: 800;
  color: ${PALLET.COLOR_06};
  text-transform: capitalize;
  margin-top: 0;
`
export const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  font-weight: 400;
  gap: 0.15rem;
  margin-top: 0.5rem;
`
export const Label = styled.h5`
  font-weight: 500;
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`
