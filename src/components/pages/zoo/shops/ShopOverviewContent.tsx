"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useShopStore, type ShopItem } from "@/store/useShopStore";
import ShopDesktopTable from "./ShopDesktopTable";
import ShopMobileCard from "./ShopMobileCard";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import Pagination from "@/components/elements/Pagination/Pagination";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { RegionSelect } from "@/components/elements/Filter/RegionSelect";

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

interface ShopOverviewContentProps {
  shops: ShopItem[];
  regions: Region[];
}

export default function ShopOverviewContent({ shops, regions }: ShopOverviewContentProps) {
  const t = useTranslations("shop");
  const tCommon = useTranslations("common");

  const setInitialShops = useShopStore((s) => s.setInitialShops);
  const currentItems = useShopStore((s) => s.currentItems);
  const filteredCount = useShopStore((s) => s.filteredCount);
  const itemsPerPage = useShopStore((s) => s.itemsPerPage);
  const currentPage = useShopStore((s) => s.currentPage);
  const searchTerm = useShopStore((s) => s.searchTerm);
  const setSearchTerm = useShopStore((s) => s.setSearchTerm);
  const selectedRegionId = useShopStore((s) => s.selectedRegionId);
  const setSelectedRegionId = useShopStore((s) => s.setSelectedRegionId);
  const nextPage = useShopStore((s) => s.nextPage);
  const prevPage = useShopStore((s) => s.prevPage);

  useEffect(() => {
    setInitialShops(shops);
  }, [shops, setInitialShops]);

  const hasItems = currentItems.length > 0;

  return (
    <>
      <FilterCard>
        <SearchInputField
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t("search_placeholder")}
        />
        <RegionSelect
          regions={regions}
          selectedRegionId={selectedRegionId}
          onChange={setSelectedRegionId}
        />
      </FilterCard>
      <ResultsInfo currentCount={currentItems.length} totalCount={filteredCount} unit={t("overview_unit")} />
      {hasItems ? (
        <>
          <DesktopView>
            <ShopDesktopTable shops={currentItems} />
          </DesktopView>
          <MobileCardList>
            {currentItems.map((s) => (
              <ShopMobileCard key={s.id} shop={s} />
            ))}
          </MobileCardList>
        </>
      ) : (
        <EmptyState
          object="shops"
          title={t("emptyState.title")}
          message={tCommon("emptyState.message")}
        />
      )}
      <Pagination
        currentPage={currentPage}
        filteredCount={filteredCount}
        itemsPerPage={itemsPerPage}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </>
  );
}

const DesktopView = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    display: none;
  }

  /* override global table min-width so no horizontal scrollbar appears */
  table {
    min-width: unset;
    width: 100%;
  }
`;

const MobileCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (min-width: 769px) {
    display: none;
  }
`;
