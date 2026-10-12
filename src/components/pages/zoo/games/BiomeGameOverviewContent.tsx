"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import BiomeGameDesktopTable from "./BiomeGameDesktopTable";
import BiomeGameMobileCard from "./BiomeGameMobileCard";
import BiomeGamePagination from "./BiomeGamePagination";
import BiomeGameFilter from "./BiomeGameFilter";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import { useGameStore } from "@/store/useGameStore";

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
  const setInitialGames = useGameStore((state) => state.setInitialGames);
  const currentItems = useGameStore((state) => state.currentItems);
  const filteredCount = useGameStore((state) => state.filteredCount);

  useEffect(() => {
    setInitialGames(games);
  }, [games, setInitialGames]);

  return (
    <>
      <BiomeGameFilter />
      <ResultsInfo currentCount={currentItems.length} totalCount={filteredCount} />
      <DesktopView>
        <BiomeGameDesktopTable games={currentItems} />
      </DesktopView>
      <MobileCardList>
        {currentItems.map((game) => (
          <BiomeGameMobileCard key={game.id} game={game} />
        ))}
      </MobileCardList>
      <BiomeGamePagination />
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
