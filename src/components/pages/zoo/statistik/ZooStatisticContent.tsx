"use client";

import React from "react";
import { useTranslations } from "next-intl";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ZooStatisticCard from "@/components/pages/zoo/statistik/ZooStatisticCard";
import ZooSummaryCard from "@/components/pages/zoo/statistik/ZooSummaryCard";
import { BiomeStatistic } from "@/types/zooStatistic";
import styled from "styled-components";

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

interface ZooStatisticContentProps {
  biomeStatistics: BiomeStatistic[];
}

export default function ZooStatisticContent({ biomeStatistics }: ZooStatisticContentProps) {
  const t = useTranslations("zooStatistic");

  return (
    <>
      <PageHeader text={t("title")} />
      <Wrapper>
        <ZooSummaryCard biomeStatistics={biomeStatistics} />
        <Grid>
          {biomeStatistics.map((stat) => (
            <ZooStatisticCard key={stat.biomeId} stat={stat} />
          ))}
        </Grid>
      </Wrapper>
    </>
  );
}