"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import PageHeader from "@/components/page-structure/page/PageHeader";
import FormattedDate from "@/components/ui/Formatted/FormattedDate";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import { AnimalStats } from "@/utils/ContestUtil";
import type { getContestById } from "@/service/ContestService";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";

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
    <RelativeWrapper>
      <ContentWrapper>
        <AdminActions>
          <ActionGroupBadge id={contest.id} onEdit={onEdit} onDelete={onDelete} />
        </AdminActions>

        <PageHeader text={t("contestOverview.details.headline")} />

        <MetaInfo>
          <FormattedDate date={contest.startDate} /> – <FormattedDate date={contest.endDate} />
        </MetaInfo>

        {!isExpired && (
          <ActionRow>
            <Link href={`/contests/${contest.id}/entries`}>
              <StyledButton type="button">{t("contestOverview.details.postAnimals")}</StyledButton>
            </Link>
          </ActionRow>
        )}

        <AnimalGrid>
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
              <AnimalCard key={animal.id}>
                <AnimalHeader>
                  <ThumbnailBadge
                    image={{ path: imagePath, name: animalName, alt: animalName }}
                    name={animalName}
                    biome={{ name: biomeName }}
                    size={50}
                  />
                  <TitleGroup>
                    <h3>{animalName}</h3>
                    <GrandTotal>{stats.totalWeighted.toLocaleString()} Pkt.</GrandTotal>
                  </TitleGroup>
                </AnimalHeader>

                <List>
                  <ListHeader>
                    <span>{t("contestOverview.details.rank")}</span>
                    <span>{t("contestOverview.details.member")}</span>
                    <span>{t("contestOverview.details.points")}</span>
                  </ListHeader>

                  {stats.rankedUser.map((m, i) => (
                    <Row key={i}>
                      <Badge>{i + 1}</Badge>
                      <Name>{m.name}</Name>
                      <Points>
                        <small>
                          {m.rawSum} × {m.multiplier}
                        </small>
                        <strong>{m.weighted.toLocaleString()}</strong>
                      </Points>
                    </Row>
                  ))}

                  {stats.rankedUser.length === 0 && (
                    <Empty>{t("contestOverview.details.noPosts")}</Empty>
                  )}
                </List>
              </AnimalCard>
            );
          })}
        </AnimalGrid>
      </ContentWrapper>
    </RelativeWrapper>
  );
}

const RelativeWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const AdminActions = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing(1)};
  right: ${({ theme }) => theme.spacing(1)};
`;

const MetaInfo = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.ui.textMain};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing(3)};
  padding: 0 ${({ theme }) => theme.spacing(1)};
  box-sizing: border-box;
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(3)};
  background-color: ${({ theme }) => theme.colors.primary["500"]};
  color: ${({ theme }) => theme.colors.ui.white};
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: ${({ theme }) => theme.borderRadius.main};
  border: none;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary["600"]};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.soft};
  }

  &:active {
    transform: translateY(0);
  }
`;

const AnimalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing(2.5)};
`;

const AnimalCard = styled.div`
  background: ${({ theme }) => theme.colors.ui.white};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  border: 1px solid ${({ theme }) => theme.colors.ui.border};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
`;

const AnimalHeader = styled.div`
  background: ${({ theme }) => theme.colors.ui.whiteSoft};
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary["100"]};
`;

const TitleGroup = styled.div`
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

const GrandTotal = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary["500"]};
`;

const List = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.ui.borderMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 5px 3px 5px;
  margin-bottom: 2px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui.borderLight};

  span:nth-child(1) {
    width: 30px;
    text-align: center;
  }
  span:nth-child(2) {
    flex: 1;
    text-align: left;
  }
  span:nth-child(3) {
    text-align: right;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: 5px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui.borderLight};

  &:last-child {
    border: none;
  }
`;

const Badge = styled.span`
  background: ${({ theme }) => theme.colors.ui.whiteSoft};
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 5px;
  flex-shrink: 0;
`;

const Name = styled.span`
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  padding-left: 5px;
`;

const Points = styled.div`
  text-align: right;

  small {
    display: block;
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.ui.borderMuted};
    line-height: 1;
  }

  strong {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

const Empty = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.ui.borderMuted};
  padding: ${({ theme }) => theme.spacing(2.5)};
  font-style: italic;
`;
