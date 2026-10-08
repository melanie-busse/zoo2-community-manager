"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import BiomeHeaderCard from "./BiomeHeaderCard";
import ShelterLevelCard from "./ShelterLevelCard";
import BiomeGameCard from "./BiomeGameCard";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { hasMinimumRole } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteBiomeOnClient } from "@/service/frontend/Biome";

interface ShelterLevel {
  id: number;
  level: number;
  cost: number;
  pricetype: number;
  buildTime: number | null;
  unlockLevel: number | null;
}

interface BiomeGame {
  id: number;
  identifier: string;
  price: number;
  pricetype: number;
  repair: number;
  repairpricetype: number;
  texts: { name: string }[];
}

interface Biome {
  id: number;
  identifier: string;
  price: number | null;
  expansionsCost: number | null;
  size: number | null;
  biomestext: { biomeName: string }[];
  priceType: { name: string } | null;
  shelters: ShelterLevel[];
  games: BiomeGame[];
}

interface BiomeDetailContentProps {
  biome: Biome;
}

export default function BiomeDetailContent({ biome }: BiomeDetailContentProps) {
  const t = useTranslations("biome");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = hasMinimumRole(session, "Director");

  const handleDelete = async () => {
    const confirmed = await confirmDeleteDialog({
      title: t("form.messages.deleteErrorTitle"),
      text: t("form.messages.confirmDelete"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });
    if (!confirmed) return;
    try {
      await deleteBiomeOnClient(biome.id);
      toast.success(t("form.messages.deleteSuccess"));
      router.push("/zoo/biomes");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <DetailWrapper>
      {isAdmin && (
        <ActionsRow>
          <ActionGroupBadge
            id={biome.id}
            onEdit={() => router.push(`/zoo/biomes/${biome.id}/edit`)}
            onDelete={handleDelete}
          />
        </ActionsRow>
      )}

      <BiomeHeaderCard biome={biome} />

      {biome.shelters.length > 0 && (
        <ShelterLevelCard levels={biome.shelters} biomeIdentifier={biome.identifier} />
      )}

      {biome.games.length > 0 && (
        <BiomeGameCard biomeIdentifier={biome.identifier} games={biome.games} />
      )}
    </DetailWrapper>
  );
}

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;
