import styled from "styled-components";
import React from "react";

export default function WikiTitelParagraph({
  title,
  paragraph,
  children,
}: {
  title: string;
  paragraph: string;
  children?: React.ReactNode;
}) {
  return (
    <DetailSection>
      <SubTitle>{title}</SubTitle>
      {paragraph && <p>{paragraph}</p>}
      {children}
    </DetailSection>
  );
}

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  p {
    margin: 0;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

const SubTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #2d5a27;
  margin: 12px 0 4px 0;
  padding-bottom: 4px;
  border-bottom: ${({ theme }) => theme.border.subtitle};
`;
