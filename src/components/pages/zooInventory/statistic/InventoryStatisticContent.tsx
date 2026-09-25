"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { InventoryBiomeStatistic } from "@/types/inventoryStatistic";
import PageHeader from "@/components/page-structure/page/PageHeader";
import InventoryStatisticCard from "./InventoryStatisticCard";
import InventorySummaryCard from "./InventorySummaryCard";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

interface InventoryStatisticContentProps {
  biomeStatistics: InventoryBiomeStatistic[];
}

export default function InventoryStatisticContent({
  biomeStatistics,
}: InventoryStatisticContentProps) {
  const t = useTranslations("inventoryStatistic");

  return (
    <>
      <PageHeader text={t("title")} />
      <Wrapper>
        <InventorySummaryCard biomeStatistics={biomeStatistics} />
        <Grid>
          {biomeStatistics.map((stat) => (
            <InventoryStatisticCard key={stat.biomeId} stat={stat} />
          ))}
        </Grid>
      </Wrapper>
    </>
  );
}