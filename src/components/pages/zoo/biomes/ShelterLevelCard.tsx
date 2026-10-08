"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import * as Styles from "@/components/pages/animals/AnimalDetails/AnimalDetails.styles";

function toCurrencyType(pricetype: number | null): CurrencyType {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

interface ShelterLevel {
  id: number;
  level: number;
  cost: number;
  pricetype: number;
  buildTime: number | null;
  unlockLevel: number | null;
}

interface ShelterLevelCardProps {
  levels: ShelterLevel[];
  biomeIdentifier: string;
}

export default function ShelterLevelCard({ levels, biomeIdentifier }: ShelterLevelCardProps) {
  const t = useTranslations("biome");
  const shelterIcon = `/images/biomes/${biomeIdentifier}/shelter.png`;

  return (
    <Card>
      <CardHeader>
        <ImageWrapper>
          <NextImage src={shelterIcon} alt={t("shelter_levels")} width={45} height={45} style={{ objectFit: "contain" }} />
        </ImageWrapper>
        <CardTitle>{t("shelter_levels")}</CardTitle>
      </CardHeader>
      <Styles.XpTable>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>{t("level")}</th>
            <th style={{ textAlign: "right" }}>{t("build_cost")}</th>
            <th style={{ textAlign: "right" }}>{t("upgrade_time")}</th>
            <th style={{ textAlign: "right" }}>{t("unlock_level")}</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((lvl) => (
            <tr key={lvl.id}>
              <Styles.TableCell style={{ textAlign: "left", fontWeight: "bold", color: "#2d5a27" }}>
                {t("level_value", { level: lvl.level })}
              </Styles.TableCell>
              <Styles.TableCell>
                <CurrencyBadge value={lvl.cost} type={toCurrencyType(lvl.pricetype)} />
              </Styles.TableCell>
              <Styles.TableCell>
                {lvl.buildTime != null ? t("minutes", { n: lvl.buildTime }) : "—"}
              </Styles.TableCell>
              <Styles.TableCell>
                {lvl.unlockLevel != null ? lvl.unlockLevel : "—"}
              </Styles.TableCell>
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

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: #2d5a27;
`;
