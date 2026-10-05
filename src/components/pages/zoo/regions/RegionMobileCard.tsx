"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import CardStatsRow from "@/components/page-structure/Card/CardStatsRow";
import { Name } from "@/components/elements/Name/Name";
import CurrencyBadge from "@/components/ui/badges/CurrencyBadge";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteRegionOnClient } from "@/service/frontend/Region";
import styled from "styled-components";

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 0.9rem;
`;

interface Region {
  id: number;
  identifier: string;
  price: number;
  unlocklevel: number;
  regionTexts: { name: string }[];
  _count: { breedingCenterSlots: number };
}

export default function RegionMobileCard({ region }: { region: Region }) {
  const t = useTranslations("region");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = hasMinimumRole(session, "Director") || isMayor(session);
  const name = region.regionTexts[0]?.name ?? region.identifier;
  const imgSrc = `/images/regions/${region.identifier}/icon.jpg`;

  const handleDelete = async () => {
    const confirmed = await confirmDeleteDialog({
      title: t("form.messages.deleteErrorTitle"),
      text: t("form.messages.confirmDelete"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });
    if (!confirmed) return;
    try {
      await deleteRegionOnClient(region.id);
      toast.success(t("form.messages.deleteSuccess"));
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <CardContainer onClick={() => router.push(`/zoo/regions/${region.id}`)}>
      <CardHeaderRow>
        <Name>{name}</Name>
        {isAdmin ? (
          <ActionGroupBadge
            id={region.id}
            onEdit={() => router.push(`/zoo/regions/${region.id}/edit`)}
            onDelete={handleDelete}
          />
        ) : (
          <Image src={imgSrc} alt={name} width={48} height={48} style={{ objectFit: "cover", borderRadius: 4 }} />
        )}
      </CardHeaderRow>
      <CardDivider />
      <CardStatsRow>
        <InfoRow>
          <span>{tCommon("price")}</span>
          <CurrencyBadge value={region.price} type="Diamond" />
        </InfoRow>
        <InfoRow>
          <span>{t("unlock_level")}</span>
          <span>{t("level_value", { level: region.unlocklevel })}</span>
        </InfoRow>
        <InfoRow>
          <span>{t("breeding_slots")}</span>
          <span>{region._count.breedingCenterSlots}</span>
        </InfoRow>
      </CardStatsRow>
    </CardContainer>
  );
}
