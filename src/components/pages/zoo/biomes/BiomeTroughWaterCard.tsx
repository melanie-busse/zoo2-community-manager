"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";

function toCurrencyType(pricetype: number): CurrencyType {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

interface TroughOrWater {
  id: number;
  price: number;
  pricetype: number;
  repair?: number;
}

interface BiomeTroughWaterCardProps {
  title: string;
  imagePath: string;
  items: TroughOrWater[];
  showRepair?: boolean;
}

export default function BiomeTroughWaterCard({ title, imagePath, items, showRepair = true }: BiomeTroughWaterCardProps) {
  const t = useTranslations("biome");

  return (
    <Card>
      <CardHeader>
        <ImageWrapper>
          <NextImage src={imagePath} alt={title} width={48} height={48} style={{ objectFit: "contain" }} />
        </ImageWrapper>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {items.length === 0 ? (
        <EmptyNote>—</EmptyNote>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>{t("price")}</Th>
              {showRepair && <Th>{t("repair")}</Th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <Td>
                  <CurrencyBadge value={item.price} type={toCurrencyType(item.pricetype)} />
                </Td>
                {showRepair && item.repair != null && (
                  <Td>
                    <CurrencyBadge value={item.repair} type={toCurrencyType(item.pricetype)} />
                  </Td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}

const Card = styled.div`
  width: 100%;
  background: white;
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.div`
  font-weight: 700;
  font-size: 1rem;
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
`;
