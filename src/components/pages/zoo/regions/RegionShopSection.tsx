"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";

interface ShopLevel {
  id: number;
  shopId: number;
  level: number;
  cost: number;
  currency: string;
  maxCapacity: number;
  buildTime: string;
}

export interface ShopWithLevels {
  id: number;
  regionId: number | null;
  name: string;
  coinsPerClient: number | null;
  levels: ShopLevel[];
}

interface RegionShopSectionProps {
  regionIdentifier: string;
  shops: ShopWithLevels[];
}

function toCurrencyType(currency: string): CurrencyType {
  return currency === "DIAMONDS" ? "Diamond" : "Zoodollar";
}

export default function RegionShopSection({ regionIdentifier, shops }: RegionShopSectionProps) {
  const tRegion = useTranslations("region");

  if (shops.length === 0) return null;

  const identifier = regionIdentifier.toLowerCase();

  return (
    <InfoAccordion title={tRegion("shops")} icon="/images/icons/buildings.png" defaultOpen={false}>
      <ShopList>
        {shops.map((shop) => (
          <ShopCard key={shop.id}>
            <ShopImageWrapper>
              <img
                src={`/images/regions/${identifier}/shops/${shop.name}/image.jpg`}
                alt={shop.name}
                width={180}
                height={120}
                style={{ objectFit: "cover", display: "block" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </ShopImageWrapper>

            <ShopInfo>
              <ShopName>{shop.name}</ShopName>
              {shop.coinsPerClient != null && (
                <CoinsLine>
                  {shop.coinsPerClient} {tRegion("coins_per_client")}
                </CoinsLine>
              )}

              {shop.levels.length > 0 && (
                <LevelTable>
                  <thead>
                    <tr>
                      <LevelTh style={{ textAlign: "left" }}>Level</LevelTh>
                      <LevelTh>{tRegion("build_cost")}</LevelTh>
                      <LevelTh>{tRegion("max_capacity")}</LevelTh>
                      <LevelTh>{tRegion("build_time_label")}</LevelTh>
                    </tr>
                  </thead>
                  <tbody>
                    {shop.levels.map((lvl) => (
                      <tr key={lvl.id}>
                        <LevelTd style={{ textAlign: "left", fontWeight: 600 }}>{lvl.level}</LevelTd>
                        <LevelTd>
                          <CurrencyBadge value={lvl.cost} type={toCurrencyType(lvl.currency)} />
                        </LevelTd>
                        <LevelTd>{lvl.maxCapacity}</LevelTd>
                        <LevelTd>{lvl.buildTime}</LevelTd>
                      </tr>
                    ))}
                  </tbody>
                </LevelTable>
              )}
            </ShopInfo>
          </ShopCard>
        ))}
      </ShopList>
    </InfoAccordion>
  );
}

const ShopList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ShopCard = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: flex-start;
  background: #f9fbf5;
  border: 1px solid #e8f0d8;
  border-radius: 10px;
  padding: 12px;
`;

const ShopImageWrapper = styled.div`
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  background: #f0f0f0;
  min-width: 180px;
  min-height: 120px;
`;

const ShopInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ShopName = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: #2d5a27;
`;

const CoinsLine = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const LevelTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  margin-top: 6px;
`;

const LevelTh = styled.th`
  text-align: right;
  color: #888;
  font-weight: normal;
  padding: 4px 8px;
`;

const LevelTd = styled.td`
  text-align: right;
  padding: 4px 8px;
  border-top: 1px solid #f0f0f0;
  color: #333;
`;
