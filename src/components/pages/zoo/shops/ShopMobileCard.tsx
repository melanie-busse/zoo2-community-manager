"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import CardStatsRow from "@/components/page-structure/Card/CardStatsRow";
import { Name } from "@/components/elements/Name/Name";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { hasMinimumRole } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteShopOnClient } from "@/service/frontend/Shop";
import type { ShopItem } from "@/store/useShopStore";

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 0.9rem;
`;

export default function ShopMobileCard({ shop }: { shop: ShopItem }) {
  const t = useTranslations("shop");
  const tCommon = useTranslations("common");
  const { data: session } = useSession();
  const router = useRouter();
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
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <CardContainer>
      <CardHeaderRow>
        <Name>{shop.name}</Name>
        {isAdmin && (
          <ActionGroupBadge
            id={shop.id}
            onEdit={() => router.push(`/zoo/shops/${shop.id}/edit`)}
            onDelete={handleDelete}
          />
        )}
      </CardHeaderRow>
      <CardDivider />
      <CardStatsRow>
        <InfoRow>
          <span>{t("region")}</span>
          <span>{shop.region?.identifier ?? <em style={{ color: "#aaa" }}>{t("unassigned")}</em>}</span>
        </InfoRow>
        {shop.coinsPerClient != null && (
          <InfoRow>
            <span>{t("coins_per_client")}</span>
            <span>{shop.coinsPerClient}</span>
          </InfoRow>
        )}
        <InfoRow>
          <span>{t("levels")}</span>
          <span>{shop.levels.length}</span>
        </InfoRow>
      </CardStatsRow>
    </CardContainer>
  );
}
