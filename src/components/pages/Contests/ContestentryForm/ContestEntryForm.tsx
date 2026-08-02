"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import PageHeader from "@/components/page-structure/page/PageHeader";
import FormattedDate from "@/components/ui/Formatted/FormattedDate";
import FormSelect from "@/components/ui/form/Selectbox";
import DynamicRowInput, { ColumnDefinition } from "@/components/ui/form/DynamicRowInput";
import SubmitButton from "@/components/ui/form/SubmitButton";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import type { getContestById } from "@/service/ContestService";
import type { User } from "@/types/user";

type ContestDetail = NonNullable<Awaited<ReturnType<typeof getContestById>>>;
type EntryRow = Record<string, string | number> & { id: number | string };

interface EntryHandlers {
  addRow: (animalId: number) => void;
  removeRow: (animalId: number, rowId: number | string) => void;
  handleRowChange: (animalId: number, rowId: number | string, key: string, value: string) => void;
}

interface ContestEntryFormProps {
  contest: ContestDetail;
  members: User[];
  selectedMemberId: string;
  onMemberChange: (id: string) => void;
  entries: Record<number, EntryRow[]>;
  columns: ColumnDefinition[];
  handlers: EntryHandlers;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export default function ContestEntryForm({
  contest,
  members,
  selectedMemberId,
  onMemberChange,
  entries,
  columns,
  handlers,
  onSubmit,
  isSubmitting,
}: ContestEntryFormProps) {
  const t = useTranslations("contest");
  const tCommon = useTranslations("common");

  return (
    <form onSubmit={onSubmit}>
      <HeaderSection>
        <PageHeader text={t("contestOverview.entry.title")} />
        <DateRange>
          <FormattedDate date={contest.startDate} /> – <FormattedDate date={contest.endDate} />
        </DateRange>
      </HeaderSection>

      <Section>
        <FormSelect
          id="member-select"
          label={t("contestOverview.entry.clubMember")}
          value={selectedMemberId}
          onChange={(e) => onMemberChange(e.target.value)}
          placeholder={t("contestOverview.entry.chooseMember")}
          options={members.map((m) => ({
            value: m.id,
            label: m.upjersname || m.name || String(m.id),
          }))}
          required
        />
      </Section>

      {contest.conteststatue.map(({ statue }) => {
        const animal = statue.animal;
        const animalName = animal.animaltext?.[0]?.animalName ?? "";
        const biomeIdentifier = animal.biome?.identifier ?? "standard";
        const animalImage = animal.image ?? "placeholder.png";
        const imagePath =
          animalImage === "placeholder.png"
            ? "/images/placeholder.jpg"
            : `/images/animals/${biomeIdentifier}/${animalImage}`;

        return (
          <AnimalSection key={animal.id}>
            <AnimalHeader>
              <ThumbnailBadge
                image={{ path: imagePath, name: animalName, alt: animalName }}
                name={animalName}
                biome={{ name: biomeIdentifier }}
                size={45}
              />
              <h3>{animalName}</h3>
            </AnimalHeader>

            <DynamicRowInput
              columns={columns}
              rows={entries[animal.id] ?? []}
              onAdd={() => handlers.addRow(animal.id)}
              onRemove={(rowId) => handlers.removeRow(animal.id, rowId)}
              onChange={(rowId, key, value) =>
                handlers.handleRowChange(animal.id, rowId, key, value)
              }
            />
          </AnimalSection>
        );
      })}

      {contest.contestspecialcoat.map(({ specialcoat }) => {
        const animal = specialcoat.animal;
        const animalName = animal.animaltext?.[0]?.animalName ?? "";
        const coatName = specialcoat.specialcoatstext?.[0]?.name ?? "";
        const coatImage = specialcoat.image ?? "placeholder.png";
        const imagePath =
          coatImage === "placeholder.png"
            ? "/images/placeholder.jpg"
            : `/images/specialcoats/${coatImage}`;
        const displayName = coatName ? `${animalName} – ${coatName}` : animalName;

        return (
          <SpecialCoatSection key={specialcoat.id}>
            <AnimalHeader>
              <ThumbnailBadge
                image={{ path: imagePath, name: displayName, alt: displayName }}
                name={displayName}
                biome={{ name: "" }}
                size={45}
              />
              <h3>{displayName}</h3>
            </AnimalHeader>

            <DynamicRowInput
              columns={columns}
              rows={entries[animal.id] ?? []}
              onAdd={() => handlers.addRow(animal.id)}
              onRemove={(rowId) => handlers.removeRow(animal.id, rowId)}
              onChange={(rowId, key, value) =>
                handlers.handleRowChange(animal.id, rowId, key, value)
              }
            />
          </SpecialCoatSection>
        );
      })}

      <SubmitButton
        label={isSubmitting ? tCommon("saving") : tCommon("save")}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const DateRange = styled.p`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary["500"]};
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.ui.white};
  padding: ${({ theme }) => theme.spacing(2.5)};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  margin-bottom: ${({ theme }) => theme.spacing(2.5)};
  border: 1px solid ${({ theme }) => theme.colors.ui.border};
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
`;

const AnimalSection = styled(Section)`
  border-left: 5px solid ${({ theme }) => theme.colors.primary["100"]};
`;

const SpecialCoatSection = styled(Section)`
  border-left: 5px solid ${({ theme }) => theme.colors.primary["500"]};
`;

const AnimalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;
