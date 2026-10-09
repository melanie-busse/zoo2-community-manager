"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";
import Table from "@/components/page-structure/Table/Table";
import * as Styles from "@/components/page-structure/Table/Table.styles";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import PriceBadge from "@/components/ui/badges/PriceBadge";
import { hasMinimumRole } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteBiomeOnClient } from "@/service/frontend/Biome";

interface Biome {
  id: number;
  identifier: string;
  price: number | null;
  expansionsCost: number | null;
  biomestext: { biomeName: string }[];
  priceType: { name: string } | null;
}

interface BiomeOverviewContentProps {
  biomes: Biome[];
}

export default function BiomeOverviewContent({ biomes }: BiomeOverviewContentProps) {
  const t = useTranslations("biome");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = hasMinimumRole(session, "Director");

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDeleteDialog({
      title: t("form.messages.deleteErrorTitle"),
      text: t("form.messages.confirmDelete"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });
    if (!confirmed) return;
    try {
      await deleteBiomeOnClient(id);
      toast.success(t("form.messages.deleteSuccess"));
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th>{t("name")}</th>
          <Styles.TableHeaderRight>{t("price")}</Styles.TableHeaderRight>
          <Styles.TableHeaderRight>{t("expansion_cost")}</Styles.TableHeaderRight>
          {isAdmin && <Styles.TableHeaderRight>{tCommon("actions")}</Styles.TableHeaderRight>}
        </tr>
      </thead>
      <tbody>
        {biomes.map((biome) => {
          const name = biome.biomestext[0]?.biomeName ?? biome.identifier;
          const imgSrc = `/images/biomes/${biome.identifier}/area.webp`;
          const badgeType: "Zoodollar" | "Diamond" =
            biome.priceType?.name === "Diamond" ? "Diamond" : "Zoodollar";

          return (
            <tr key={biome.id}>
              <td>
                <Styles.TableThumbnail>
                  <Image
                    src={imgSrc}
                    alt={name}
                    width={64}
                    height={64}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                </Styles.TableThumbnail>
              </td>
              <td>
                <strong
                  style={{ cursor: "pointer", color: "#2d5a27" }}
                  onClick={() => router.push(`/zoo/biomes/${biome.id}`)}
                >
                  {name}
                </strong>
              </td>
              <Styles.TableCellRight>
                {biome.price != null ? (
                  <PriceBadge value={biome.price} type={badgeType} />
                ) : (
                  "—"
                )}
              </Styles.TableCellRight>
              <Styles.TableCellRight>
                {biome.expansionsCost != null ? (
                  <PriceBadge value={biome.expansionsCost} type={badgeType} />
                ) : (
                  "—"
                )}
              </Styles.TableCellRight>
              {isAdmin && (
                <Styles.TableCellRight>
                  <ActionGroupBadge
                    id={biome.id}
                    onEdit={() => router.push(`/zoo/biomes/${biome.id}/edit`)}
                    onDelete={() => handleDelete(biome.id)}
                  />
                </Styles.TableCellRight>
              )}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
