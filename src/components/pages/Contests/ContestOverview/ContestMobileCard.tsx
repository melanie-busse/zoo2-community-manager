"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { Contest } from "@/types/contest";

import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import * as Styles from "./ContestOverview.styles";
import { StatusBadge } from "@/components/ui/badges/StatusBadge";
import { useSession } from "next-auth/react";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { getAnimalImage } from "@/utils/AnimalUtil";
import { getSpecialCoatImage } from "@/utils/SpecialCoatUtil";
import { useLocale } from "next-intl";
import { getStatueName } from "@/utils/ContestUtil";

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

        {isAdmin && <ActionGroupBadge id={contest.id} onEdit={onEdit} onDelete={onDelete} />}

        <StatusBadge isActive={isActive} />
      </Styles.CardHeader>

      <Styles.AnimalGrid>
        {contest.conteststatue?.map((contestStatue) => {
          const animal = contestStatue.animal;

          if (!animal) return null;

          return (
            <Styles.AnimalItem key={contestStatue.id}>
              {animal.image && (
                <ThumbnailBadge
                  image={getAnimalImage(animal)}
                  name={animal.name}
                  biome={animal.biome}
                  size={65}
                />
              )}
              <Styles.TinyName>
                {getStatueName(animal, "unbekannte Statue")}
              </Styles.TinyName>
            </Styles.AnimalItem>
          );
        })}

        {contest.contestspecialcoat?.map((link) => {
          const coat = link.specialcoat;
          if (!coat) return null;
          const name =
            coat.specialcoatstext?.[0]?.name ||
            coat.animal?.animaltext?.[0]?.animalName ||
            `Coat #${coat.id}`;
          return (
            <Styles.AnimalItem key={link.id}>
              <ThumbnailBadge
                image={getSpecialCoatImage(coat)}
                biome={coat.animal?.biome}
                name={name}
                size={65}
              />
              <Styles.TinyName>{name}</Styles.TinyName>
            </Styles.AnimalItem>
          );
        })}
      </Styles.AnimalGrid>
    </Styles.Card>
  );
}
