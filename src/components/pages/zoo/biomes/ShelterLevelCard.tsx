"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
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
    <InfoAccordion
      title={t("shelter_levels")}
      icon={shelterIcon}
      iconSize={45}
      defaultOpen={true}
    >
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
    </InfoAccordion>
  );
}
