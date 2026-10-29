import React from "react";
import styled from "styled-components";

import CardContainer from "@/components/page-structure/Card/CardContainer";
import GameBadge from "@/components/ui/badges/GameBadge";
import { Image } from "@/types/image";

interface WikiHeaderProps {
  title: string;
  introParagraph: string;
  image?: Image;
}

export default function WikiHeader({ title, introParagraph, image }: WikiHeaderProps) {
  return (
    <CardContainer>
      <HeaderWrapper>
        {image && (
          <ImageWrapper>
            <GameBadge image={image} size={150} />
          </ImageWrapper>
        )}

        <InfoSection>
          <TitleContent>
            <h1>{title}</h1>
          </TitleContent>
          <IntroParagraph>{introParagraph}</IntroParagraph>
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

export const ImageWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    border-radius: 12px;
    overflow: hidden;
  }
`;

export const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const IntroParagraph = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin: 0;
  line-height: 1.6;
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
    font-size: 2rem;
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
