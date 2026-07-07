"use client";

import React from "react";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalDetails.styles";

import SpecialCoatBadge from "@/components/ui/badges/SpecialCoatBadge";
import { SpecialCoat } from "@/types/specialCoat";
import { formatLocaleDate } from "@/utils/DateUtil";

interface SpecialCoatCardProps {
  specialCoat: SpecialCoat;
}

export default function SpecialCoatCard({ specialCoat }: SpecialCoatCardProps) {
  const tCommon = useTranslations("Common");
  const origins = specialCoat.specialcoatsorigin?.map((o) => o.origin).filter(Boolean) ?? [];

  const displayName = specialCoat.specialcoatstext?.[0]?.name || "";
  const releaseDate = specialCoat.releaseDate
    ? String(formatLocaleDate(specialCoat.releaseDate))
    : "---";

  return (
    <Styles.StyledSpecialCoatCard title={displayName}>
      <SpecialCoatBadge image={specialCoat.image} displayName={displayName} />

      <Styles.SpecialCoatName>{displayName}</Styles.SpecialCoatName>

      <Styles.ReleaseDate>
        📅 {tCommon("release")}: {releaseDate}
      </Styles.ReleaseDate>

      {origins.length > 0 && (
        <Styles.OriginContainer>
          {origins.map((origin) => (
            <Styles.OriginRowSpecialCoat key={origin!.id} title={origin!.name}>
              <NextImage
                src={`/images/origins/${origin!.image}`}
                alt={origin!.name}
                width={20}
                height={20}
              />
            </Styles.OriginRowSpecialCoat>
          ))}
        </Styles.OriginContainer>
      )}
    </Styles.StyledSpecialCoatCard>
  );
}
