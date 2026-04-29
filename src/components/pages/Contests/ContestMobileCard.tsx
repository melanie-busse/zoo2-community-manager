"use client";

import React from "react";

import { useTranslations, useLocale } from "next-intl";
import { Calendar } from "lucide-react";
import { Contest } from "@/types/contest";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import * as Styles from "./ContestOverview.styles";
import { StatusBadge } from "@/components/ui/badges/StatusBadge";
import ActionBadge from "@/components/ui/badges/ActionBadge";
import { useSession } from "next-auth/react";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";

interface ContestMobileCardProps {
  contest: Contest;
  onClick?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ContestMobileCard({
  contest,
  onClick,
  onEdit,
  onDelete,
}: ContestMobileCardProps) {
  const t = useTranslations("contests");
  const locale = useLocale();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "Director";

  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };

  // Date-Parsing für String-Daten (aus JSON)
  const start = new Date(contest.startDate);
  const end = new Date(contest.endDate);
  const now = new Date();

  const startDateStr = start.toLocaleDateString(locale, options);
  const endDateStr = end.toLocaleDateString(locale, options);
  const isActive = now >= start && now <= end;

  return (
    <Styles.Card onClick={onClick}>
      <Styles.CardHeader>
        <Styles.DateInfo>
          <Calendar size={14} />
          <span>
            {startDateStr} - {endDateStr}
          </span>
        </Styles.DateInfo>

        {isAdmin && <ActionGroupBadge object={contest} onEdit={onEdit} onDelete={onDelete} />}

        <StatusBadge isActive={isActive} />
      </Styles.CardHeader>

      <Styles.AnimalGrid>
        {contest.conteststatue?.map((link) => {
          const statue = link.statue;
          const animal = statue.animal;

          if (!animal) return null;

          const animalname = animal.name || "Unbekannt";

          return (
            <Styles.AnimalItem key={link.id}>
              <ThumbnailBadge
                image={animal.image}
                name={animalname}
                size={65}
                category={`animals/${(animal.category || "grassland").toLowerCase()}`}
              />
              <Styles.TinyName>{animalname}</Styles.TinyName>
            </Styles.AnimalItem>
          );
        })}
      </Styles.AnimalGrid>
    </Styles.Card>
  );
}
