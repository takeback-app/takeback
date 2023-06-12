import styled from 'styled-components'

export const Container = styled.main`
  padding: 1rem;
  overflow: scroll;
  height: 100%;
`
export const Description = styled.p`
  color: ${props => props.theme.colors['gray-600']};
  font-size: 0.9rem;
  font-family: 'Inter';
  line-height: 1rem;
  margin-top: 0.5rem;
`
export const Toggle = styled.button`
  margin-top: 1rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors['gray-600']};
  font-size: 0.9rem;
  padding: 8px 15px;
  color: #333;
`
export const ModalContent = styled.div`
  position: relative;
  @media (max-width: 768px) {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 85vh;
  }
`
export const ModalFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 15px;

  @media (max-width: 768px) {
    position: absolute;
    width: 100%;
    margin-top: 15px;
    bottom: 2rem;
    gap: 15px;
  }
`
