"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import { Animal } from "@/types/animal";
import XPBadge from "@/components/ui/badges/XPBadge";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import { getShelterImage } from "@/utils/BiomeUtil";
import PriceBadge from "@/components/ui/badges/PriceBadge";
import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import DataRow from "@/components/ui/DataRow";
import { formatMinutes } from "@/components/ui/Formatted/XpDateFormat";
import { XP } from "@/constants/Xp";

const ACTION_ORDER = ["feed", "play", "clean"];

interface AccordionCardProps {
  animal: Animal | null;
}

export default function AccordionCard({ animal }: AccordionCardProps) {
  const tAnimals = useTranslations("Animals");
  const tBiomes = useTranslations("Biome");
  const tCommon = useTranslations("Common");

  if (!animal) return null;

  const xpData = animal.animalxp || [];
  const capacityData = animal.animalperenclosure || [];
  const hasCapacity = capacityData.length > 0;

  return (
    <aside>
      {/* Accordion 1: Breeding */}
      <InfoAccordion title={tAnimals("breeding.breeding")} icon="/images/icons/breeding.png">
        <DataRow label={tBiomes("shelterLevel")}>
          <ShelterLevelBadge
            image={getShelterImage(animal.biome)}
            level={animal.shelterLevel}
            habitat={animal.biome?.name}
            size={35}
            showTooltip={false}
          />
        </DataRow>

        <DataRow label={tCommon("price")}>
          <PriceBadge value={animal.breedingCost || 0} type="Zoodollar" />
        </DataRow>

        <DataRow label={tCommon("time")}>
          <strong>{animal.breedingDuration || 0} h</strong>
        </DataRow>

        <DataRow label={tAnimals("breeding.breedingChance")}>
          <strong>{animal.breedingProbability || 0} %</strong>
        </DataRow>
      </InfoAccordion>

      {/* Accordion 2: XP & Actions */}
      <InfoAccordion title={tAnimals("breeding.xpAndActions")} icon="/images/icons/star.png">
        <XpTable>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>{tCommon("action")}</th>
              <th style={{ textAlign: "center" }}>{tCommon("time")}</th>
              <THRight>XP</THRight>
            </tr>
          </thead>
          <tbody>
            {xpData.map((item) => {
              const actionInfo = XP[item.xptype?.id];

              return (
                <tr key={item.id}>
                  <td>
                    <ActionWrapper>
                      {actionInfo?.icon && (
                        <NextImage
                          src={actionInfo.icon}
                          alt={actionInfo.key || "action"}
                          width={20}
                          height={20}
                        />
                      )}
                    </ActionWrapper>
                  </td>
                  <td style={{ textAlign: "center" }}>{formatMinutes(item.xpDuration)}</td>
                  <td>
                    <XPBadge label={item.xpValue} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </XpTable>
      </InfoAccordion>

      {/* Accordion 3: Habitat Capacity */}
      <InfoAccordion title={tAnimals("biomeCapacity")} icon="/images/icons/paw.png">
        {hasCapacity ? (
          <XpTable>
            <thead>
              <tr>
                <TableHeader>{tAnimals("animalCount")}</TableHeader>
                <TableHeader>{tAnimals("biomeSize")}</TableHeader>
              </tr>
            </thead>
            <tbody>
              {capacityData.map((kap) => (
                <tr key={kap.numberAnimals}>
                  <TableCell>{kap.numberAnimals}</TableCell>
                  <TableCell>{kap.numberEnclosure}</TableCell>
                </tr>
              ))}
            </tbody>
          </XpTable>
        ) : (
          <EmptyState>{tCommon("loading_data")}</EmptyState>
        )}
      </InfoAccordion>
    </aside>
  );
}

// --- Styled Components ---
const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: capitalize;
`;

const XpTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th {
    text-align: right;
    color: #888;
    padding-bottom: 8px;
    font-weight: normal;
  }

  td {
    padding: 6px 0;
    border-bottom: 1px solid #f5f5f5;
  }
`;

const THRight = styled.th`
  text-align: right !important;
  display: table-cell;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
  text-align: right;

  &:first-child {
    font-weight: bold;
    color: #555;
  }
`;

const EmptyState = styled.p`
  padding: 15px;
  text-align: center;
  color: #888;
  font-style: italic;
`;
