"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "@/i18n/routing";

import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { formatLocaleDate } from "@/utils/DateUtil";
import type { ChestBoostListItem } from "@/types/chestBoost";

interface Props {
  boost: ChestBoostListItem;
  onDelete: (id: number) => void;
}

export default function ChestBoostMobileCard({ boost, onDelete }: Props) {
  const t = useTranslations("chestBoosts");
  const { data: session } = useSession();
  const router = useRouter();
  const canEdit = hasMinimumRole(session, "Director") && !isMayor(session);

  const chestTypeLabel = (type: string) => {
    if (type === "EPIC") return t("chest_type_epic");
    if (type === "RETRO") return t("chest_type_retro");
    if (type === "LEGENDARY") return t("chest_type_legendary");
    return type;
  };

  return (
    <Card>
      <CardHeader>
        <Image
          src={
            boost.animal.identifier
              ? `/images/animals/${boost.animal.biome.identifier}/${boost.animal.identifier}/image.jpg`
              : "/images/placeholder.jpg"
          }
          alt={boost.animal.name}
          width={48}
          height={48}
          style={{ objectFit: "contain", borderRadius: 6 }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
          }}
        />
        <CardAnimalInfo>
          <CardAnimalName>{boost.animal.name}</CardAnimalName>
          <CardBiomeName>{boost.animal.biome.name}</CardBiomeName>
        </CardAnimalInfo>
        {boost.isEvent && <EventBadge>{t("event_badge")}</EventBadge>}
      </CardHeader>

      <CardRow>
        <CardLabel>{t("column_period")}</CardLabel>
        <CardValue>
          {formatLocaleDate(boost.startDate)} – {formatLocaleDate(boost.endDate)}
        </CardValue>
      </CardRow>

      <CardRow>
        <CardLabel>{t("column_chest_type")}</CardLabel>
        <CardValue>{chestTypeLabel(boost.chestType)}</CardValue>
      </CardRow>

      {canEdit && (
        <CardActions>
          <ActionGroupBadge
            id={boost.id}
            onEdit={() => router.push(`/game/chests/${boost.id}/edit` as any)}
            onDelete={() => onDelete(boost.id)}
          />
        </CardActions>
      )}
    </Card>
  );
}

const Card = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const CardAnimalInfo = styled.div`
  flex: 1;
`;

const CardAnimalName = styled.div`
  font-weight: 700;
  font-size: 1rem;
`;

const CardBiomeName = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.grey[100]};
`;

const EventBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.accent.main};
  color: white;
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 0.88rem;
`;

const CardLabel = styled.span`
  color: ${({ theme }) => theme.colors.grey[100]};
  font-weight: 500;
`;

const CardValue = styled.span`
  font-weight: 600;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;
