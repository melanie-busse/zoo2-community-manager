import styled from "styled-components";

export default function WikiSubSectionTitle({ children }: { children: React.ReactNode }) {
  return <Title>{children}</Title>;
}

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;
