"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import * as Styles from "@/components/pages/animals/AnimalDetails/AnimalDetails.styles";

function toCurrencyType(currency: string): CurrencyType {
  return currency === "DIAMONDS" ? "Diamond" : "Zoodollar";
}

interface ShopLevel {
  id: number;
  level: number;
  cost: number;
  currency: string;
  maxCapacity: number;
  buildTime: string;
}

interface ShopLevelCardProps {
  levels: ShopLevel[];
}

export default function ShopLevelCard({ levels }: ShopLevelCardProps) {
  const t = useTranslations("shop");

  return (
    <Card>
      <CardTitle>{t("levels")}</CardTitle>
      <Styles.XpTable>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>{t("level_value", { level: "" }).replace(" ", "")}</th>
            <th style={{ textAlign: "right" }}>{t("build_cost")}</th>
            <th style={{ textAlign: "right" }}>{t("max_capacity")}</th>
            <th style={{ textAlign: "right" }}>{t("build_time")}</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((lvl) => (
            <tr key={lvl.id}>
              <Styles.TableCell style={{ textAlign: "left", fontWeight: "bold", color: "#2d5a27" }}>
                {t("level_value", { level: lvl.level })}
              </Styles.TableCell>
              <Styles.TableCell>
                <CurrencyBadge value={lvl.cost} type={toCurrencyType(lvl.currency)} />
              </Styles.TableCell>
              <Styles.TableCell>{lvl.maxCapacity.toLocaleString()}</Styles.TableCell>
              <Styles.TableCell>{lvl.buildTime || "—"}</Styles.TableCell>
            </tr>
          ))}
        </tbody>
      </Styles.XpTable>
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

const CardTitle = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: #2d5a27;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;
