"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/elements/Pagination/Pagination.styles";

import Tooltip from "@/components/ui/tooltip/Tooltip";
import { useAnimalStore } from "@/store/useAnimalStore";

export default function Pagination() {
  const t = useTranslations();

  const currentPage = useAnimalStore((state) => state.currentPage);
  const filteredCount = useAnimalStore((state) => state.filteredCount);
  const itemsPerPage = useAnimalStore((state) => state.itemsPerPage);

  const onNext = useAnimalStore((state) => state.nextPage);
  const onPrev = useAnimalStore((state) => state.prevPage);

  const totalPages = Math.ceil(filteredCount / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <Styles.SignpostAssembly>
      <Tooltip text={t("Pagination.prev")}>
        <Styles.SignpostButton $direction="prev" onClick={onPrev} disabled={currentPage === 1} />
      </Tooltip>

      <Styles.PageIndicator>
        <div>
          {currentPage} <small>/</small> {totalPages}
        </div>
      </Styles.PageIndicator>

      <Tooltip text={t("Pagination.next")}>
        <Styles.SignpostButton
          $direction="next"
          onClick={onNext}
          disabled={currentPage === totalPages}
        />
      </Tooltip>
    </Styles.SignpostAssembly>
  );
}
