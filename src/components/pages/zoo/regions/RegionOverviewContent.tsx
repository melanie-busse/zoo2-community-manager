"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import RegionDesktopTable from "./RegionDesktopTable";
import RegionMobileCard from "./RegionMobileCard";
import RegionFilter from "./RegionFilter";
import RegionPagination from "./RegionPagination";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { useRegionStore } from "@/store/useRegionStore";
import type { RegionItem } from "@/store/useRegionStore";

interface RegionOverviewContentProps {
  regions: RegionItem[];
}

export default function RegionOverviewContent({ regions }: RegionOverviewContentProps) {
  const t = useTranslations("region");
  const tCommon = useTranslations("common");

  const setInitialRegions = useRegionStore((state) => state.setInitialRegions);
  const currentItems = useRegionStore((state) => state.currentItems);
  const filteredCount = useRegionStore((state) => state.filteredCount);

  useEffect(() => {
    setInitialRegions(regions);
  }, [regions, setInitialRegions]);

  return (
    <>
      <RegionFilter />
      <ResultsInfo currentCount={currentItems.length} totalCount={filteredCount} />
      {currentItems.length > 0 ? (
        <>
          <DesktopView>
            <RegionDesktopTable regions={currentItems} />
          </DesktopView>
          <MobileCardList>
            {currentItems.map((region) => (
              <RegionMobileCard key={region.id} region={region} />
            ))}
          </MobileCardList>
        </>
      ) : (
        <EmptyState
          object="regions"
          title={t("emptyState.title")}
          message={tCommon("emptyState.message")}
        />
      )}
      <RegionPagination />
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
