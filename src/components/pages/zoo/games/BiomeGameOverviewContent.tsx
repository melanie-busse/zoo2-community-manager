"use client";

import React from "react";
import styled from "styled-components";
import BiomeGameDesktopTable from "./BiomeGameDesktopTable";
import BiomeGameMobileCard from "./BiomeGameMobileCard";

export interface BiomeGame {
  id: number;
  identifier: string;
  biomeIdentifier: string;
  price: number;
  pricetype: number;
  repair: number;
  repairpricetype: number;
  texts: { name: string }[];
}

interface BiomeGameOverviewContentProps {
  games: BiomeGame[];
}

export default function BiomeGameOverviewContent({ games }: BiomeGameOverviewContentProps) {
  return (
    <>
      <DesktopView>
        <BiomeGameDesktopTable games={games} />
      </DesktopView>
      <MobileCardList>
        {games.map((game) => (
          <BiomeGameMobileCard key={game.id} game={game} />
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
