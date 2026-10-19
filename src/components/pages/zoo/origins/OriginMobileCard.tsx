"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import { Name } from "@/components/elements/Name/Name";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { hasMinimumRole } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteOriginOnClient } from "@/service/frontend/Origin";
import type { OriginItem } from "./OriginOverviewContent";

export default function OriginMobileCard({ origin }: { origin: OriginItem }) {
  const t = useTranslations("origin");
  const tCommon = useTranslations("common");
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = hasMinimumRole(session, "Director");

  const name = origin.origintext[0]?.originName ?? origin.identifier ?? "-";
  const imgSrc = `/images/origins/${origin.identifier}/image.jpg`;

  const handleDelete = async () => {
    const confirmed = await confirmDeleteDialog({
      title: t("form.messages.deleteErrorTitle"),
      text: t("form.messages.confirmDelete"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });
    if (!confirmed) return;
    try {
      await deleteOriginOnClient(origin.id);
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
            id={origin.id}
            onEdit={() => router.push(`/zoo/origins/${origin.id}/edit`)}
            onDelete={handleDelete}
          />
        ) : (
          origin.identifier && (
            <img
              src={imgSrc}
              alt={name}
              width={48}
              height={48}
              style={{ objectFit: "contain", borderRadius: 4, flexShrink: 0 }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )
        )}
      </CardHeaderRow>
      {origin.identifier && (
        <>
          <CardDivider />
          <small style={{ color: "#888", padding: "4px 0" }}>{origin.identifier}</small>
        </>
      )}
    </CardContainer>
  );
}
