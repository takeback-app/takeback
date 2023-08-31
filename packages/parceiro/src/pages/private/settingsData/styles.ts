import styled from 'styled-components'

export const Container = styled.main`
  height: 84%;
  padding: 0.5rem;
`
export const Card = styled.div`
  width: 100%;
  height: 60vh;
  border-radius: 10px;
  padding: 0.8rem 0;
  background-color: #fff;

  @media (max-width: 750px) {
    height: 100vh;
  }
`
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #7070703e;
  padding: 0 1rem 0.5rem 1rem;
  color: ${props => props.theme.colors['blue-700']};
`
export const CardMain = styled.div`
  width: 100%;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.7rem 1rem;
  padding: 0.5rem 1.5rem;
  overflow-x: hidden;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`
export const industryLabel = styled.h6`
  font-family: 'Inter';
  font-weight: 600;
  font-size: 12px;
  color: #707070;
`

export const CardTitle = styled.h5`
  font-size: 0.9rem;
  font-weight: bold;
  color: ${props => props.theme.colors['blue-700']};
`
export const CardFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
  margin-bottom: 3rem;
  height: 14%;
`
export const ModalContent = styled.div`
  width: 100%;
  height: 60vh;
  border-radius: 10px;
  padding: 0.8rem 0;
  position: relative;
  background-color: #fff;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 90vh;
  }
`

export const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 30px;

  @media (max-width: 768px) {
    position: absolute;
    width: 100%;
    margin-top: 15px;
    bottom: 2rem;
  }
`

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem 0;
  gap: 20px;

  @media (max-width: 450px) {
    flex-direction: column;
    gap: 10px;
  }
`
export const SmallCard = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.8rem;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  background-color: #fff;
  font-family: 'Inter';
  border: 1px solid rgba(186, 186, 186, 0.3);

  ${props => props.theme.shadows.sm}

  @media (max-width: 450px) {
    width: 100%;
    justify-content: flex-start;
    gap: 20px;
  }
`
export const SmallCardTitle = styled.h5`
  font-weight: 400;
  color: ${props => props.theme.colors['slate-300']};
`
export const SmallCardContent = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors['slate-600']};
  text-transform: capitalize;
`
export const Label = styled.label`
  font-family: 'Inter';
  margin-left: 10px;
`
