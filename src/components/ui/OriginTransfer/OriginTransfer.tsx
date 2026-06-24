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
  allOrigins: TransferItem[]; // 🆕 Alle verfügbaren Herkünfte aus der DB
  selectedIds: number[]; // 🆕 Nur die IDs, die aktuell ausgewählt sind
  onChange: (newSelectedIds: number[]) => void; // 🆕 Der zentrale Callback
  maxSelected?: number | null;
}

export default function OriginTransfer({
  allOrigins = [],
  selectedIds = [],
  onChange,
  maxSelected = null,
}: OriginTransferProps) {
  const t = useTranslations("Common");

  // 🎯 Logik intern gekapselt: Berechne, wer links steht (nicht in selectedIds)
  const available = allOrigins.filter((o) => !selectedIds.includes(o.id));

  // Berechne, wer rechts steht (sichert, dass Name & ID korrekt gemappt sind)
  const selected = allOrigins.filter((o) => selectedIds.includes(o.id));

  const isFull = maxSelected !== null && selectedIds.length >= maxSelected;

  // ➡️ Nach rechts verschieben (ID hinzufügen)
  const handleMoveRight = (item: TransferItem) => {
    if (isFull) return;
    onChange([...selectedIds, item.id]);
  };

  // ⬅️ Nach links verschieben (ID entfernen)
  const handleMoveLeft = (item: TransferItem) => {
    onChange(selectedIds.filter((id) => id !== item.id));
  };

  return (
    <Styles.TransferContainer>
      {/* --- LINKER CONTAINER (Verfügbar) --- */}
      <Styles.Column>
        <Styles.ColumnTitle>{t("available")}</Styles.ColumnTitle>
        <Styles.List>
          {available.length === 0 ? (
            <Styles.EmptyNote>{t("messages.no_more_items")}</Styles.EmptyNote>
          ) : (
            available.map((item) => (
              <Styles.Item key={item.id} onClick={() => handleMoveRight(item)} $disabled={isFull}>
                <span>{item.name}</span>
                <ChevronRight size={16} />
              </Styles.Item>
            ))
          )}
        </Styles.List>
      </Styles.Column>

      {/* --- RECHTER CONTAINER (Ausgewählt) --- */}
      <Styles.Column $highlight>
        <Styles.ColumnTitle>{t("chosen")}</Styles.ColumnTitle>
        <Styles.List>
          {selected.length === 0 ? (
            <Styles.EmptyNote>{t("messages.none_selected")}</Styles.EmptyNote>
          ) : (
            selected.map((item) => (
              <Styles.Item key={item.id} onClick={() => handleMoveLeft(item)} $selected>
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
