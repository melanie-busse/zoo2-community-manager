"use client";

import React from "react";
import styled from "styled-components";
import RegionHeaderCard from "./RegionHeaderCard";

interface Region {
  identifier: string;
  price: number;
  unlocklevel: number;
  releasedate: Date;
  regionTexts: { name: string }[];
  priceType: { name: string } | null;
}

interface RegionDetailContentProps {
  region: Region;
}

export default function RegionDetailContent({ region }: RegionDetailContentProps) {
  return (
    <Wrapper>
      <RegionHeaderCard region={region} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    margin-left: -16px;
    margin-right: -16px;
    width: calc(100% + 32px);
    padding-left: 8px;
    padding-right: 8px;
  }

  @media (min-width: 1024px) {
    padding: 0;
  }
`;
