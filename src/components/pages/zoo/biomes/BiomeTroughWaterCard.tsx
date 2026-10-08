"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";

function toCurrencyType(pricetype: number): CurrencyType {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

interface TroughOrWater {
  id: number;
  price: number;
  pricetype: number;
  repair: number;
}

interface BiomeTroughWaterCardProps {
  troughs: TroughOrWater[];
  waterHoles: TroughOrWater[];
}

function ItemTable({ items }: { items: TroughOrWater[] }) {
  const t = useTranslations("biome");

  if (items.length === 0) {
    return <EmptyNote>—</EmptyNote>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>{t("price")}</Th>
          <Th>{t("repair")}</Th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <Td>
              <CurrencyBadge value={item.price} type={toCurrencyType(item.pricetype)} />
            </Td>
            <Td>
              <CurrencyBadge value={item.repair} type={toCurrencyType(item.pricetype)} />
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default function BiomeTroughWaterCard({ troughs, waterHoles }: BiomeTroughWaterCardProps) {
  const t = useTranslations("biome");

  return (
    <InfoAccordion title={t("trough_and_water")} icon="/images/icons/info.png" defaultOpen={true}>
      <Section>
        <SectionTitle>{t("form.troughs")}</SectionTitle>
        <ItemTable items={troughs} />
      </Section>
      <Section>
        <SectionTitle>{t("form.water_holes")}</SectionTitle>
        <ItemTable items={waterHoles} />
      </Section>
    </InfoAccordion>
  );
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
  color: #2d5a27;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1)};
  color: #666;
  font-weight: 500;
  font-size: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing(0.75)} ${({ theme }) => theme.spacing(1)};
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
`;

const EmptyNote = styled.div`
  color: #999;
  font-size: 0.85rem;
  padding: ${({ theme }) => theme.spacing(0.5)} 0;
`;
