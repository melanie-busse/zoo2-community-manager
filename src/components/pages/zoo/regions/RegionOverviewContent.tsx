"use client";

import React from "react";
import styled from "styled-components";
import RegionDesktopTable from "./RegionDesktopTable";
import RegionMobileCard from "./RegionMobileCard";

interface Region {
  id: number;
  identifier: string;
  price: number;
  unlocklevel: number;
  regionTexts: { name: string }[];
  _count: { breedingCenterSlots: number };
}

interface RegionOverviewContentProps {
  regions: Region[];
}

export default function RegionOverviewContent({ regions }: RegionOverviewContentProps) {
  return (
    <>
      <DesktopView>
        <RegionDesktopTable regions={regions} />
      </DesktopView>
      <MobileCardList>
        {regions.map((region) => (
          <RegionMobileCard key={region.id} region={region} />
        ))}
      </MobileCardList>
    </>
  );
}

const DesktopView = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileCardList = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0 2px;
    width: 100%;
  }
`;
