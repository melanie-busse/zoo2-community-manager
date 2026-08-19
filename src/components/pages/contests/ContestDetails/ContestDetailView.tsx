"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import * as Styles from "./ContestDetailView.styles";

import PageHeader from "@/components/page-structure/page/PageHeader";
import FormattedDate from "@/components/ui/Formatted/FormattedDate";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import { AnimalStats } from "@/utils/ContestUtil";
import type { getContestById } from "@/service/ContestService";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import SubmitButton from "@/components/ui/form/SubmitButton";
import RangBadge from "@/components/ui/badges/RangBadge";

type ContestDetail = NonNullable<Awaited<ReturnType<typeof getContestById>>>;
type ContestAnimal = ContestDetail["conteststatue"][number]["animal"];

interface Analysis {
  animal: ContestAnimal;
  stats: AnimalStats;
}

interface ContestDetailViewProps {
  contest: ContestDetail;
  animals?: Analysis[];
  specialCoat?: Analysis[];
  onEdit: () => void;
  onDelete: () => void;
}

export default function ContestDetailView({
  contest,
  animals,
  specialCoat,
  onEdit,
  onDelete,
}: ContestDetailViewProps) {
  const t = useTranslations("contest");
  const isExpired = new Date() > new Date(contest.endDate);
  const analysis = [animals, specialCoat].flat().filter(Boolean) as Analysis[];

  return (
    <Styles.RelativeWrapper>
      <ContentWrapper>
        <Styles.AdminActions>
          <ActionGroupBadge id={contest.id} onEdit={onEdit} onDelete={onDelete} />
        </Styles.AdminActions>

        <PageHeader text={t("contestOverview.details.headline")} />

        <Styles.MetaInfo>
          <FormattedDate date={contest.startDate} /> – <FormattedDate date={contest.endDate} />
        </Styles.MetaInfo>

        {!isExpired && (
          <Styles.ActionRow>
            <Link href={`/contests/${contest.id}/entries`}>
              <SubmitButton label={t("contestOverview.details.postAnimals")} isSubmitting={false} />
            </Link>
          </Styles.ActionRow>
        )}

        <Styles.AnimalGrid>
          {analysis?.map(({ animal, stats }) => {
            const animalName = animal.animaltext?.[0]?.animalName ?? "";
            const biomeIdentifier = animal.biome?.identifier ?? "standard";
            const biomeName = biomeIdentifier;
            const animalImage = animal.image ?? "placeholder.png";
            const imagePath =
              animalImage === "placeholder.png"
                ? "/images/placeholder.jpg"
                : `/images/animals/${biomeIdentifier}/${animalImage}`;

            return (
              <Styles.AnimalCard key={animal.id}>
                <Styles.AnimalHeader>
                  <ThumbnailBadge
                    image={{ path: imagePath, name: animalName, alt: animalName }}
                    name={animalName}
                    biome={{ name: biomeName }}
                    size={50}
                  />
                  <Styles.TitleGroup>
                    <h3>{animalName}</h3>
                    <Styles.GrandTotal>
                      {stats.totalWeighted.toLocaleString()} Pkt.
                    </Styles.GrandTotal>
                  </Styles.TitleGroup>
                </Styles.AnimalHeader>

                <Styles.List>
                  <Styles.ListHeader>
                    <span>{t("contestOverview.details.rank")}</span>
                    <span>{t("contestOverview.details.member")}</span>
                    <span>{t("contestOverview.details.points")}</span>
                  </Styles.ListHeader>

                  {stats.rankedUser.map((m, i) => (
                    <Styles.Row key={i}>
                      <RangBadge label={i + 1} />
                      <Styles.Name>{m.name}</Styles.Name>
                      <Styles.Points>
                        <small>
                          {m.rawSum} × {m.multiplier}
                        </small>
                        <strong>{m.weighted.toLocaleString()}</strong>
                      </Styles.Points>
                    </Styles.Row>
                  ))}

                  {stats.rankedUser.length === 0 && (
                    <Styles.Empty>{t("contestOverview.details.noPosts")}</Styles.Empty>
                  )}
                </Styles.List>
              </Styles.AnimalCard>
            );
          })}
        </Styles.AnimalGrid>
      </ContentWrapper>
    </Styles.RelativeWrapper>
  );
}
