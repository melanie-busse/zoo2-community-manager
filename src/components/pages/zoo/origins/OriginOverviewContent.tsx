"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import OriginDesktopTable from "./OriginDesktopTable";
import OriginMobileCard from "./OriginMobileCard";
import OriginPagination from "./OriginPagination";
import OriginFilter from "./OriginFilter";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { useOriginStore } from "@/store/useOriginStore";

export interface OriginItem {
  id: number;
  identifier: string | null;
  origintext: { originName: string }[];
}

interface OriginOverviewContentProps {
  origins: OriginItem[];
}

export default function OriginOverviewContent({ origins }: OriginOverviewContentProps) {
  const t = useTranslations("origin");
  const tCommon = useTranslations("common");

  const setInitialOrigins = useOriginStore((state) => state.setInitialOrigins);
  const currentItems = useOriginStore((state) => state.currentItems);
  const filteredCount = useOriginStore((state) => state.filteredCount);

  useEffect(() => {
    setInitialOrigins(origins);
  }, [origins, setInitialOrigins]);

  const hasItems = currentItems.length > 0;

  return (
    <>
      <OriginFilter />
      <ResultsInfo currentCount={currentItems.length} totalCount={filteredCount} unit={t("overview_unit")} />
      {hasItems ? (
        <>
          <DesktopView>
            <OriginDesktopTable origins={currentItems} />
          </DesktopView>
          <MobileCardList>
            {currentItems.map((origin) => (
              <OriginMobileCard key={origin.id} origin={origin} />
            ))}
          </MobileCardList>
        </>
      ) : (
        <EmptyState
          object="origins"
          title={t("emptyState.title")}
          message={tCommon("emptyState.message")}
        />
      )}
      <OriginPagination />
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
