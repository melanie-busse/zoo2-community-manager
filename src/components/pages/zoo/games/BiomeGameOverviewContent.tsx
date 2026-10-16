"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import BiomeGameDesktopTable from "./BiomeGameDesktopTable";
import BiomeGameMobileCard from "./BiomeGameMobileCard";
import BiomeGamePagination from "./BiomeGamePagination";
import BiomeGameFilter from "./BiomeGameFilter";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
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

export interface BiomeSummary {
  identifier: string;
  biomestext: { biomeName: string }[];
}

interface BiomeGameOverviewContentProps {
  games: BiomeGame[];
  biomes: BiomeSummary[];
}

export default function BiomeGameOverviewContent({ games, biomes }: BiomeGameOverviewContentProps) {
  const t = useTranslations("game");
  const tCommon = useTranslations("common");

  const setInitialGames = useGameStore((state) => state.setInitialGames);
  const currentItems = useGameStore((state) => state.currentItems);
  const filteredCount = useGameStore((state) => state.filteredCount);

  useEffect(() => {
    setInitialGames(games);
  }, [games, setInitialGames]);

  const hasItems = currentItems.length > 0;

  return (
    <>
      <BiomeGameFilter biomes={biomes} />
      <ResultsInfo currentCount={currentItems.length} totalCount={filteredCount} unit={t("overview_unit")} />
      {hasItems ? (
        <>
          <DesktopView>
            <BiomeGameDesktopTable games={currentItems} />
          </DesktopView>
          <MobileCardList>
            {currentItems.map((game) => (
              <BiomeGameMobileCard key={game.id} game={game} />
            ))}
          </MobileCardList>
        </>
      ) : (
        <EmptyState
          object="games"
          title={t("emptyState.title")}
          message={tCommon("emptyState.message")}
        />
      )}
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
