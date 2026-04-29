"use client";

import styled from "styled-components";

interface PageHeaderProps {
  text: string;
}

export default function PageHeader({ text }: PageHeaderProps) {
  return (
    <StyledHeader>
      <Headline>{text}</Headline>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 40px;
  text-align: center;
`;

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.comic}, serif;
  font-size: clamp(2rem, 5vw, 3rem);
  color: ${({ theme }) => theme.colors.primary["700"]};
  letter-spacing: -0.02em;
  margin: 0;

  &::after {
    content: "";
    display: block;
    width: 60px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.primary["100"]};
    margin: 15px auto 0;
    border-radius: 2px;
  }
`;
