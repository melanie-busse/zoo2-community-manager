"use client";

import React from "react";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalDetails.styles";

import SpecialCoatBadge from "@/components/ui/badges/SpecialCoatBadge";
import { SpecialCoat } from "@/types/specialCoat";
import { formatLocaleDate } from "@/utils/DateUtil";
import { useRouter } from "@/i18n/routing";
import Tooltip from "@/components/ui/tooltip/Tooltip";

interface SpecialCoatCardProps {
  specialCoat: SpecialCoat;
}

export default function SpecialCoatCard({ specialCoat }: SpecialCoatCardProps) {
  const tCommon = useTranslations("common");
  const router = useRouter();
  const origins = specialCoat.specialcoatsorigin?.map((o) => o.origin).filter(Boolean) ?? [];

  const displayName = specialCoat.specialcoatstext?.[0]?.name || "";
  const releaseDate = specialCoat.releaseDate
    ? String(formatLocaleDate(specialCoat.releaseDate))
    : "---";

  return (
    <Styles.StyledSpecialCoatCard
      title={displayName}
      onClick={() => router.push(`/specialcoats/${specialCoat.id}`)}
      style={{ cursor: "pointer" }}
    >
      <SpecialCoatBadge image={specialCoat.image} displayName={displayName} />

      <Styles.SpecialCoatName>{displayName}</Styles.SpecialCoatName>

      <Styles.ReleaseDate>
        📅 {tCommon("release")}: {releaseDate}
      </Styles.ReleaseDate>

      {origins.length > 0 && (
        <Styles.OriginContainer>
          {origins.map((origin, index: number) => {
            // Nutzt das korrekte Feld aus der Übersetzungstabelle (name statt originName)
            const translatedName = origin?.origintext?.[0]?.originName || origin?.name || "";

            // WICHTIG: Das return hier hat gefehlt!
            return (
              <Styles.OriginRowSpecialCoat key={origin?.id || index}>
                <Tooltip text={translatedName} position="top">
                  <NextImage
                    src={`/images/origins/${origin?.image || "default.png"}`}
                    alt={origin?.name || "Origin"}
                    width={20}
                    height={20}
                  />
                </Tooltip>
              </Styles.OriginRowSpecialCoat>
            );
          })}
        </Styles.OriginContainer>
      )}
    </Styles.StyledSpecialCoatCard>
  );
}
