"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import ShopHeaderCard from "./ShopHeaderCard";
import ShopLevelCard from "./ShopLevelCard";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { hasMinimumRole } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteShopOnClient } from "@/service/frontend/Shop";

interface ShopLevel {
  id: number;
  level: number;
  cost: number;
  currency: string;
  maxCapacity: number;
  buildTime: string;
}

interface Shop {
  id: number;
  name: string;
  identifier: string;
  coinsPerClient: number | null;
  region: {
    identifier: string;
    regionTexts: { name: string }[];
  } | null;
  texts: { name: string }[];
  levels: ShopLevel[];
}

interface ShopDetailContentProps {
  shop: Shop;
}

export default function ShopDetailContent({ shop }: ShopDetailContentProps) {
  const t = useTranslations("shop");
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
      await deleteShopOnClient(shop.id);
      toast.success(t("form.messages.deleteSuccess"));
      router.push("/zoo/shops");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const displayName = shop.texts?.[0]?.name ?? shop.name;
  const regionName = shop.region?.regionTexts?.[0]?.name ?? shop.region?.identifier ?? null;

  return (
    <DetailWrapper>
      {isAdmin && (
        <ActionsRow>
          <ActionGroupBadge
            id={shop.id}
            onEdit={() => router.push(`/zoo/shops/${shop.id}/edit`)}
            onDelete={handleDelete}
          />
        </ActionsRow>
      )}

      <ShopHeaderCard
        name={displayName}
        identifier={shop.identifier}
        regionIdentifier={shop.region?.identifier ?? null}
        regionName={regionName}
        coinsPerClient={shop.coinsPerClient}
        levels={shop.levels}
      />

      {shop.levels.length > 0 && <ShopLevelCard levels={shop.levels} />}
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
