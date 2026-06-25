"use client";

import React from "react";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalDetails.styles";

import XPBadge from "@/components/ui/badges/XPBadge";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import { getShelterImage } from "@/utils/BiomeUtil";
import PriceBadge from "@/components/ui/badges/PriceBadge";
import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import DataRow from "@/components/ui/DataRow";
import { formatMinutes } from "@/components/ui/Formatted/XpDateFormat";
import { XP } from "@/constants/Xp";
import { useAnimalStore } from "@/store/useAnimalStore";

export default function AccordionCard() {
  const tAnimals = useTranslations("Animals");
  const tBiomes = useTranslations("Biome");
  const tCommon = useTranslations("Common");

  const animal = useAnimalStore((state) => state.selectedAnimal);
  if (!animal) return null;

  const xpData = animal.animalxp || [];
  const capacityData = animal.animalperenclosure || [];

  const hasCapacity = capacityData.length > 0;

  return (
    <aside>
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

      <InfoAccordion title={tAnimals("breeding.xpAndActions")} icon="/images/icons/star.png">
        <Styles.XpTable>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>{tCommon("action")}</th>
              <th style={{ textAlign: "center" }}>{tCommon("time")}</th>
              <Styles.THRight>XP</Styles.THRight>
            </tr>
          </thead>
          <tbody>
            {xpData.map((item) => {
              const typeId = Number(item.id);
              const actionInfo = XP[typeId];

              return (
                <tr key={item.id}>
                  <td>
                    <Styles.ActionWrapper>
                      {actionInfo?.icon && (
                        <NextImage
                          src={actionInfo.icon}
                          alt={actionInfo.key || "action"}
                          width={20}
                          height={20}
                        />
                      )}
                    </Styles.ActionWrapper>
                  </td>
                  <td style={{ textAlign: "center" }}>{formatMinutes(item.xpDuration)}</td>
                  <td>
                    <XPBadge label={item.xpValue} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Styles.XpTable>
      </InfoAccordion>

      <InfoAccordion title={tAnimals("biomeCapacity")} icon="/images/icons/paw.png">
        {hasCapacity ? (
          <Styles.XpTable>
            <thead>
              <tr>
                <Styles.TableHeader>{tAnimals("animalCount")}</Styles.TableHeader>
                <Styles.TableHeader>{tAnimals("biomeSize")}</Styles.TableHeader>
              </tr>
            </thead>
            <tbody>
              {capacityData.map((kap) => (
                <tr key={kap.numberAnimals}>
                  <Styles.TableCell>{kap.numberAnimals}</Styles.TableCell>
                  <Styles.TableCell>{kap.numberEnclosure}</Styles.TableCell>
                </tr>
              ))}
            </tbody>
          </Styles.XpTable>
        ) : (
          <Styles.EmptyState>{tCommon("loading_data")}</Styles.EmptyState>
        )}
      </InfoAccordion>
    </aside>
  );
}
