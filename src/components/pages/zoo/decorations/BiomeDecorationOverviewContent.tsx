"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import BiomeDecorationDesktopTable from "./BiomeDecorationDesktopTable";
import BiomeDecorationMobileCard from "./BiomeDecorationMobileCard";
import BiomeDecorationPagination from "./BiomeDecorationPagination";
import BiomeDecorationFilter from "./BiomeDecorationFilter";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { useDecorationStore } from "@/store/useDecorationStore";

export interface BiomeDecorationItem {
  id: number;
  identifier: string;
  price: number;
  pricetype: number;
  popularity: number;
  biome: { identifier: string };
  texts: { name: string }[];
}

export interface BiomeSummary {
  identifier: string;
  biomestext: { biomeName: string }[];
}

interface BiomeDecorationOverviewContentProps {
  decorations: BiomeDecorationItem[];
  biomes: BiomeSummary[];
}

export default function BiomeDecorationOverviewContent({ decorations, biomes }: BiomeDecorationOverviewContentProps) {
  const t = useTranslations("decoration");
  const tCommon = useTranslations("common");

  const setInitialDecorations = useDecorationStore((state) => state.setInitialDecorations);
  const currentItems = useDecorationStore((state) => state.currentItems);
  const filteredCount = useDecorationStore((state) => state.filteredCount);

  useEffect(() => {
    setInitialDecorations(decorations);
  }, [decorations, setInitialDecorations]);

  const hasItems = currentItems.length > 0;

  return (
    <>
      <BiomeDecorationFilter biomes={biomes} />
      <ResultsInfo currentCount={currentItems.length} totalCount={filteredCount} />
      {hasItems ? (
        <>
          <DesktopView>
            <BiomeDecorationDesktopTable decorations={currentItems} />
          </DesktopView>
          <MobileCardList>
            {currentItems.map((deco) => (
              <BiomeDecorationMobileCard key={deco.id} decoration={deco} />
            ))}
          </MobileCardList>
        </>
      ) : (
        <EmptyState
          object="decorations"
          title={t("emptyState.title")}
          message={tCommon("emptyState.message")}
        />
      )}
      <BiomeDecorationPagination />
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
