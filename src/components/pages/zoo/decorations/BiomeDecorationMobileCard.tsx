"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import CardStatsRow from "@/components/page-structure/Card/CardStatsRow";
import { Name } from "@/components/elements/Name/Name";
import CurrencyBadge from "@/components/ui/badges/CurrencyBadge";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteBiomeDecorationOnClient } from "@/service/frontend/BiomeDecoration";
import type { BiomeDecorationItem } from "./BiomeDecorationOverviewContent";

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 0.9rem;
`;

const PopularityValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

function toCurrencyType(pricetype: number): "Diamond" | "Zoodollar" {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

export default function BiomeDecorationMobileCard({ decoration }: { decoration: BiomeDecorationItem }) {
  const t = useTranslations("decoration");
  const tCommon = useTranslations("common");
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = hasMinimumRole(session, "Director") || isMayor(session);

  const name = decoration.texts[0]?.name ?? decoration.identifier;
  const imgSrc = `/images/biomes/${decoration.biome.identifier}/decoration/${decoration.identifier}/image.webp`;

  const handleDelete = async () => {
    const confirmed = await confirmDeleteDialog({
      title: t("form.messages.deleteErrorTitle"),
      text: t("form.messages.confirmDelete"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });
    if (!confirmed) return;
    try {
      await deleteBiomeDecorationOnClient(decoration.id);
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
            id={decoration.id}
            onEdit={() => router.push(`/zoo/decorations/${decoration.id}/edit`)}
            onDelete={handleDelete}
          />
        ) : (
          <img
            src={imgSrc}
            alt={name}
            width={48}
            height={48}
            style={{ objectFit: "contain", borderRadius: 4, flexShrink: 0 }}
            onError={(e) => {
              const el = e.currentTarget;
              if (el.src.endsWith(".webp")) el.src = imgSrc.replace(".webp", ".jpg");
            }}
          />
        )}
      </CardHeaderRow>
      <CardDivider />
      <CardStatsRow>
        <InfoRow>
          <span>{t("price")}</span>
          <CurrencyBadge value={decoration.price} type={toCurrencyType(decoration.pricetype)} />
        </InfoRow>
        <InfoRow>
          <span>{t("popularity")}</span>
          <PopularityValue>
            <span>{decoration.popularity}</span>
            <Image src="/images/icons/visitors.jpg" alt="" width={16} height={16} style={{ objectFit: "contain", borderRadius: 2 }} />
          </PopularityValue>
        </InfoRow>
      </CardStatsRow>
    </CardContainer>
  );
}
