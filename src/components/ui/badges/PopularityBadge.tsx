"use client";

import React from "react";
import NextImage from "next/image";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import ItemWrapper from "@/components/page-structure/page/ItemWrapper";

interface PopularityDisplayProps {
  popularity: number | null | undefined;
}

export default function PopularityBadge({ popularity }: PopularityDisplayProps) {
  const tCommon = useTranslations("Common");

  const hasValue = popularity !== undefined && popularity !== null;

  return (
    <ItemWrapper>
      {hasValue && <span>{popularity.toLocaleString()}</span>}
      <ImageContainer>
        <NextImage
          src="/images/icons/visitors.jpg"
          alt={tCommon("popularity")}
          width={25}
          height={16}
          style={{ objectFit: "contain" }}
        />
      </ImageContainer>
    </ItemWrapper>
  );
}

const ImageContainer = styled.div`
  display: flex;
  align-items: center;

  img {
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1));
  }
`;
