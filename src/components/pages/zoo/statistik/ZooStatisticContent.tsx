import PageHeader from "@/components/page-structure/page/PageHeader";
import React from "react";
import ZooStatisticCard from "@/components/pages/zoo/statistik/ZooStatisticCard";
import { BiomeStatistic } from "@/types/zooStatistic";
import styled from "styled-components";

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
  return (
    <>
      <PageHeader text={"Zoo Statistik"} />
      <Grid>
        {biomeStatistics.map((stat) => (
          <ZooStatisticCard key={stat.biomeId} stat={stat} />
        ))}
      </Grid>
    </>
  );
}
