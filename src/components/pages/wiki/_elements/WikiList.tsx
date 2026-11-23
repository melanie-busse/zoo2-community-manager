import styled from "styled-components";

export default function WikiList({ title, paragraph }: { title: string; paragraph: string }) {
  return (
    <List>
      <h3>{title}</h3>
      <Text>{paragraph}</Text>
    </List>
  );
}

const List = styled.div``;

const Text = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.ui.textMain};
`;
