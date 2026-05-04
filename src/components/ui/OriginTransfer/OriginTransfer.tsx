"use client";

import React from "react";

import * as Styles from "./OriginTransfer.styles";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

interface TransferItem {
  id: number;
  name: string;
}

interface OriginTransferProps {
  available: TransferItem[];
  selected: TransferItem[];
  onMoveRight: (item: TransferItem) => void;
  onMoveLeft: (item: TransferItem) => void;
  maxSelected?: number | null;
}

export default function OriginTransfer({
  available,
  selected,
  onMoveRight,
  onMoveLeft,
  maxSelected = null,
}: OriginTransferProps) {
  // Zugriff auf deine JSON-Struktur (common)
  const t = useTranslations();

  const isFull = maxSelected !== null && selected.length >= maxSelected;

  return (
    <Styles.TransferContainer>
      <Styles.Column>
        <Styles.ColumnTitle>{t("Common.available")}</Styles.ColumnTitle>
        <Styles.List>
          {available.length === 0 ? (
            <Styles.EmptyNote>{t("Common.no_more_statues")}</Styles.EmptyNote>
          ) : (
            available.map((item) => (
              <Styles.Item key={item.id} onClick={() => onMoveRight(item)} $disabled={isFull}>
                <span>{item.name}</span>
                <ChevronRight size={16} />
              </Styles.Item>
            ))
          )}
        </Styles.List>
      </Styles.Column>

      <Styles.Column $highlight>
        <Styles.ColumnTitle>{t("Common.chosen")}</Styles.ColumnTitle>
        <Styles.List>
          {selected.length === 0 ? (
            <Styles.EmptyNote>{t("Common.none_selected")}</Styles.EmptyNote>
          ) : (
            selected.map((item) => (
              <Styles.Item key={item.id} onClick={() => onMoveLeft(item)} $selected>
                <ChevronLeft size={16} />
                <span>{item.name}</span>
              </Styles.Item>
            ))
          )}
        </Styles.List>
      </Styles.Column>
    </Styles.TransferContainer>
  );
}
