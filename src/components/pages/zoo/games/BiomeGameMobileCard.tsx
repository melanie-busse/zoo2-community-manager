"use client";

import React from "react";
import Image from "next/image";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteBiomeGameOnClient } from "@/service/frontend/BiomeGame";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import CardStatsRow from "@/components/page-structure/Card/CardStatsRow";
import { Name } from "@/components/elements/Name/Name";
import CurrencyBadge from "@/components/ui/badges/CurrencyBadge";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import type { BiomeGame } from "./BiomeGameOverviewContent";

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 0.9rem;
`;

function toCurrencyType(pricetype: number): "Diamond" | "Zoodollar" {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

export default function BiomeGameMobileCard({ game }: { game: BiomeGame }) {
  const t = useTranslations("game");
  const tCommon = useTranslations("common");
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = hasMinimumRole(session, "Director") || isMayor(session);

  const name = game.texts[0]?.name ?? game.identifier;
  const imgSrc = `/images/biomes/${game.biomeIdentifier}/game/${game.identifier}/image.jpg`;

  const handleDelete = async () => {
    const confirmed = await confirmDeleteDialog({
      title: t("form.messages.deleteErrorTitle"),
      text: t("form.messages.confirmDelete"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });
    if (!confirmed) return;
    try {
      await deleteBiomeGameOnClient(game.id);
      toast.success(t("form.messages.deleteSuccess"));
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <CardContainer>
      <CardHeaderRow>
        <Name>{name}</Name>
        {isAdmin ? (
          <ActionGroupBadge
            id={game.id}
            onEdit={() => router.push(`/zoo/games/${game.id}/edit`)}
            onDelete={handleDelete}
          />
        ) : (
          <Image
            src={imgSrc}
            alt={name}
            width={48}
            height={48}
            style={{ objectFit: "contain", borderRadius: 4 }}
          />
        )}
      </CardHeaderRow>
      <CardDivider />
      <CardStatsRow>
        <InfoRow>
          <span>{t("price")}</span>
          <CurrencyBadge value={game.price} type={toCurrencyType(game.pricetype)} />
        </InfoRow>
        <InfoRow>
          <span>{t("repair")}</span>
          <CurrencyBadge value={game.repair} type={toCurrencyType(game.repairpricetype)} />
        </InfoRow>
      </CardStatsRow>
    </CardContainer>
  );
}
