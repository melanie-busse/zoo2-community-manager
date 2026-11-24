"use client";

import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";

import { useBonusAnimalsStore } from "@/store/useBonusAnimalsStore";
import type { BonusAnimalsResponse } from "@/service/frontend/PremiumVipAnimal";
import FilterCard from "@/components/elements/Filter/FilterCard";
import Pagination from "@/components/elements/Pagination/Pagination";
import BonusAnimalsTable from "./BonusAnimalsTable";

interface Props {
  type: "PREMIUM" | "VIP";
  initialData: BonusAnimalsResponse;
}

export default function BonusAnimalsContent({ type, initialData }: Props) {
  const t = useTranslations("animals_bonus");
  const locale = useLocale();
  const router = useRouter();

  const initializeFromSSR = useBonusAnimalsStore((state) => state.initializeFromSSR);
  const entries = useBonusAnimalsStore((state) => state.entries);
  const total = useBonusAnimalsStore((state) => state.total);
  const availableYears = useBonusAnimalsStore((state) => state.availableYears);
  const identifierFilter = useBonusAnimalsStore((state) => state.identifierFilter);
  const yearFilter = useBonusAnimalsStore((state) => state.yearFilter);
  const page = useBonusAnimalsStore((state) => state.page);
  const pageSize = useBonusAnimalsStore((state) => state.pageSize);
  const isLoading = useBonusAnimalsStore((state) => state.isLoading);
  const fetchError = useBonusAnimalsStore((state) => state.fetchError);
  const setIdentifierFilter = useBonusAnimalsStore((state) => state.setIdentifierFilter);
  const setYearFilter = useBonusAnimalsStore((state) => state.setYearFilter);
  const setPage = useBonusAnimalsStore((state) => state.setPage);
  const deleteEntry = useBonusAnimalsStore((state) => (state as any).deleteEntry);

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initializeFromSSR({ ...initialData, type, locale });
    }
  }, [initializeFromSSR, initialData, type]);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setIdentifierFilter(value);
    }, 300);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("confirm_delete"))) return;
    if (typeof deleteEntry === "function") {
      await deleteEntry(id);
    }
  };

  const displayedCount = entries.length;

  return (
    <>
      <FilterCard>
        <FilterInput
          type="text"
          defaultValue={identifierFilter}
          onChange={handleIdentifierChange}
          placeholder={t("filter_identifier")}
        />
        <FilterSelect
          value={yearFilter ?? ""}
          onChange={(e) => setYearFilter(e.target.value ? parseInt(e.target.value, 10) : null)}
        >
          <option value="">{t("filter_all_years")}</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </FilterSelect>
      </FilterCard>

      <ResultsCount>
        {t.rich("results_count", {
          shown: displayedCount,
          total,
          b: (chunks) => <strong>{chunks}</strong>,
        })}
      </ResultsCount>

      {fetchError && <ErrorMessage>{fetchError}</ErrorMessage>}

      <TableWrapper $loading={isLoading}>
        <BonusAnimalsTable
          entries={entries}
          editBasePath={type === "PREMIUM" ? "/animals/premium-animals" : "/animals/vip-animals"}
          onDelete={typeof deleteEntry === "function" ? handleDelete : undefined}
          onRowClick={(entry) => {
            if (entry.animalId !== null) {
              router.push(`/animals/${entry.animalId}` as any);
            }
          }}
        />
      </TableWrapper>

      <Pagination
        currentPage={page}
        filteredCount={total}
        itemsPerPage={pageSize}
        onNext={() => setPage(page + 1)}
        onPrev={() => setPage(page - 1)}
      />
    </>
  );
}

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.white[100]};
  border-radius: 8px;
  font-size: 0.9rem;
  min-width: 200px;
  background: rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.white[100]};
  border-radius: 8px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const ResultsCount = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.grey[100]};
  margin: ${({ theme }) => theme.spacing(2)} 0;

  strong {
    color: ${({ theme }) => theme.colors.primary[500]};
    font-weight: 700;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.status.errorText};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  margin: 0 0 ${({ theme }) => theme.spacing(1)};
  font-size: 0.9rem;
`;

const TableWrapper = styled.div<{ $loading: boolean }>`
  opacity: ${({ $loading }) => ($loading ? 0.5 : 1)};
  transition: opacity 0.2s;
  pointer-events: ${({ $loading }) => ($loading ? "none" : "auto")};
`;
