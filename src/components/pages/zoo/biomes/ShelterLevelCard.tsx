"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import * as Styles from "@/components/pages/animals/AnimalDetails/AnimalDetails.styles";

function toCurrencyType(priceTypeId: number | null): CurrencyType {
  return priceTypeId === 2 ? "Diamond" : "Zoodollar";
}

interface ShelterLevel {
  id: number;
  level: number;
  price: number | null;
  priceTypeId: number | null;
  buildCost: number | null;
  buildCostPriceTypeId: number | null;
  upgradeTime: number | null;
  unlockLevel: number | null;
}

interface ShelterLevelCardProps {
  levels: ShelterLevel[];
}

export default function ShelterLevelCard({ levels }: ShelterLevelCardProps) {
  const t = useTranslations("biome");

  return (
    <InfoAccordion
      title={t("shelter_levels")}
      icon="/images/icons/info.png"
      defaultOpen={true}
    >
      <Styles.XpTable>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>{t("level")}</th>
            <th style={{ textAlign: "right" }}>{t("price")}</th>
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
                {lvl.price != null ? (
                  <CurrencyBadge value={lvl.price} type={toCurrencyType(lvl.priceTypeId)} />
                ) : (
                  "—"
                )}
              </Styles.TableCell>
              <Styles.TableCell>
                {lvl.buildCost != null ? (
                  <CurrencyBadge value={lvl.buildCost} type={toCurrencyType(lvl.buildCostPriceTypeId)} />
                ) : (
                  "—"
                )}
              </Styles.TableCell>
              <Styles.TableCell>
                {lvl.upgradeTime != null ? t("minutes", { n: lvl.upgradeTime }) : "—"}
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
