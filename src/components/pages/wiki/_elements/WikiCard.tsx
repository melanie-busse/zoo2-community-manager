import React from "react";
import styled from "styled-components";

import CardContainer from "@/components/page-structure/Card/CardContainer";
import NextImage from "next/image";

interface WikiHeaderProps {
  title: string;
  image: string;
  children?: React.ReactNode;
}

export default function WikiCard({ title, image, children }: WikiHeaderProps) {
  return (
    <CardContainer>
      <HeaderWrapper>
        <InfoSection>
          <TitleContent>
            <NextImage src={image} alt={title} width={50} height={50} />
            <h1>{title}</h1>
          </TitleContent>
          {children}
        </InfoSection>
      </HeaderWrapper>
    </CardContainer>
  );
}

const HeaderWrapper = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

export const TitleContent = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 12px;

  h1 {
    color: #2d5a27;
    margin: 0;
    padding-left: 10px;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 1.8rem;
      text-align: center;
    }
  }

  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
  }
`;
