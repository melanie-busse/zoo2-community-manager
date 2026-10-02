"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Table from "@/components/page-structure/Table/Table";
import * as Styles from "@/components/page-structure/Table/Table.styles";
import CurrencyBadge from "@/components/ui/badges/CurrencyBadge";

interface Region {
  id: number;
  identifier: string;
  price: number;
  unlocklevel: number;
  regionTexts: { name: string }[];
  _count: { breedingCenterSlots: number };
}

interface RegionDesktopTableProps {
  regions: Region[];
}

export default function RegionDesktopTable({ regions }: RegionDesktopTableProps) {
  const t = useTranslations("region");
  const tCommon = useTranslations("common");

  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th>{t("name")}</th>
          <Styles.TableHeaderRight>{tCommon("price")}</Styles.TableHeaderRight>
          <th>{t("unlock_level")}</th>
          <th>{t("breeding_slots")}</th>
        </tr>
      </thead>
      <tbody>
        {regions.map((region) => {
          const name = region.regionTexts[0]?.name ?? region.identifier;
          const imgSrc = `/images/regions/${region.identifier}/icon.jpg`;
          return (
            <tr key={region.id}>
              <td>
                <Styles.TableThumbnail>
                  <Image
                    src={imgSrc}
                    alt={name}
                    width={64}
                    height={64}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                </Styles.TableThumbnail>
              </td>
              <td><strong>{name}</strong></td>
              <Styles.TableCellRight>
                <CurrencyBadge value={region.price} type="Diamond" />
              </Styles.TableCellRight>
              <td>{t("level_value", { level: region.unlocklevel })}</td>
              <td>{region._count.breedingCenterSlots}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
