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

interface ShopOverviewContentProps {
  shops: ShopItem[];
}

export default function ShopOverviewContent({ shops }: ShopOverviewContentProps) {
  const t = useTranslations("shop");
  const tCommon = useTranslations("common");

  const setInitialShops = useShopStore((s) => s.setInitialShops);
  const currentItems = useShopStore((s) => s.currentItems);
  const filteredCount = useShopStore((s) => s.filteredCount);
  const itemsPerPage = useShopStore((s) => s.itemsPerPage);
  const currentPage = useShopStore((s) => s.currentPage);
  const searchTerm = useShopStore((s) => s.searchTerm);
  const setSearchTerm = useShopStore((s) => s.setSearchTerm);
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
  @media (max-width: 768px) {
    display: none;
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
