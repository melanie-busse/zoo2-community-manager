import styled from "styled-components";

export default function WikiFootnote({ children }: { children: React.ReactNode }) {
  return <Footnote>{children}</Footnote>;
}

const Footnote = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.ui.textMain};
  font-style: italic;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;
