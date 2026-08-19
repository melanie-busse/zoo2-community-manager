"use client";

import React from "react";
import { useTranslations } from "next-intl";

import PageHeader from "@/components/page-structure/page/PageHeader";
import FormattedDate from "@/components/ui/Formatted/FormattedDate";
import FormSelect from "@/components/ui/form/Selectbox";
import DynamicRowInput, { ColumnDefinition } from "@/components/ui/form/DynamicRowInput";
import SubmitButton from "@/components/ui/form/SubmitButton";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import * as ContestFormStyles from "@/components/pages/contests/ContestCreateForm/ContestCreateForm.styles";
import * as Styles from "@/components/pages/contests/ContestEntryForm/ContestEntryForm.styles";
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
  onSubmit: (e: React.SubmitEvent) => void;
  onCancel: () => void;
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
  onCancel,
  isSubmitting,
}: ContestEntryFormProps) {
  const t = useTranslations("contest");
  const tCommon = useTranslations("common");

  return (
    <form onSubmit={onSubmit}>
      <Styles.HeaderSection>
        <PageHeader text={t("contestOverview.entry.title")} />
        <Styles.DateRange>
          <FormattedDate date={contest.startDate} /> – <FormattedDate date={contest.endDate} />
        </Styles.DateRange>
      </Styles.HeaderSection>

      <Styles.Section>
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
      </Styles.Section>

      {contest.conteststatue.map(({ animal }) => {
        const animalName = animal.animaltext?.[0]?.animalName ?? "";
        const biomeIdentifier = animal.biome?.identifier ?? "standard";
        const animalImage = animal.image ?? "placeholder.png";
        const imagePath =
          animalImage === "placeholder.png"
            ? "/images/placeholder.jpg"
            : `/images/animals/${biomeIdentifier}/${animalImage}`;

        return (
          <Styles.AnimalSection key={animal.id}>
            <Styles.AnimalHeader>
              <ThumbnailBadge
                image={{ path: imagePath, name: animalName, alt: animalName }}
                name={animalName}
                biome={{ name: biomeIdentifier }}
                size={45}
              />
              <h3>{animalName}</h3>
            </Styles.AnimalHeader>

            <DynamicRowInput
              columns={columns}
              rows={entries[animal.id] ?? []}
              onAdd={() => handlers.addRow(animal.id)}
              onRemove={(rowId) => handlers.removeRow(animal.id, rowId)}
              onChange={(rowId, key, value) =>
                handlers.handleRowChange(animal.id, rowId, key, value)
              }
            />
          </Styles.AnimalSection>
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
          <Styles.SpecialCoatSection key={specialcoat.id}>
            <Styles.AnimalHeader>
              <ThumbnailBadge
                image={{ path: imagePath, name: displayName, alt: displayName }}
                name={displayName}
                biome={{ name: "" }}
                size={45}
              />
              <h3>{displayName}</h3>
            </Styles.AnimalHeader>

            <DynamicRowInput
              columns={columns}
              rows={entries[animal.id] ?? []}
              onAdd={() => handlers.addRow(animal.id)}
              onRemove={(rowId) => handlers.removeRow(animal.id, rowId)}
              onChange={(rowId, key, value) =>
                handlers.handleRowChange(animal.id, rowId, key, value)
              }
            />
          </Styles.SpecialCoatSection>
        );
      })}

      <ContestFormStyles.ButtonRow>
        <SubmitButton
          label={isSubmitting ? tCommon("saving") : tCommon("save")}
          isSubmitting={isSubmitting}
        />
        <ContestFormStyles.CancelButton type="button" onClick={onCancel}>
          {tCommon("messages.cancel")}
        </ContestFormStyles.CancelButton>
      </ContestFormStyles.ButtonRow>
    </form>
  );
}
