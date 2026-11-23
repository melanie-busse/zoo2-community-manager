import styled from "styled-components";

export default function WikiSubSectionTitleParagraph({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <p>{text}</p>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;
