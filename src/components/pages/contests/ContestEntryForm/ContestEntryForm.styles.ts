import styled from "styled-components";

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const DateRange = styled.p`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary["500"]};
`;

export const Section = styled.div`
  background: ${({ theme }) => theme.colors.ui.white};
  padding: ${({ theme }) => theme.spacing(2.5)};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  margin-bottom: ${({ theme }) => theme.spacing(2.5)};
  border: 1px solid ${({ theme }) => theme.colors.ui.border};
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
`;

export const AnimalSection = styled(Section)`
  border-left: 5px solid ${({ theme }) => theme.colors.primary["100"]};
`;

export const SpecialCoatSection = styled(Section)`
  border-left: 5px solid ${({ theme }) => theme.colors.primary["500"]};
`;

export const AnimalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;
