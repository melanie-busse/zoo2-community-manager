"use client";

import React, { useState, useMemo } from "react";
import * as Styles from "./OriginTransfer.styles";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import InputField from "@/components/ui/form/InputField"; // Passe den Pfad ggf. an dein Projekt an

interface TransferItem {
  id: number;
  name: string;
  imagePath?: string;
}

interface OriginTransferProps {
  allOrigins: TransferItem[]; // Alle verfügbaren Herkünfte aus der DB
  selectedIds: number[]; // Nur die IDs, die aktuell ausgewählt sind
  onChange: (newSelectedIds: number[]) => void; // Der zentrale Callback
  maxSelected?: number | null;
}

export default function OriginTransfer({
  allOrigins = [],
  selectedIds = [],
  onChange,
  maxSelected = null,
}: OriginTransferProps) {
  const t = useTranslations("common");

  // State für die Suchfilter
  const [searchAvailable, setSearchAvailable] = useState("");
  const [searchSelected, setSearchSelected] = useState("");

  // 🎯 Logik intern gekapselt: Berechne, wer links steht (nicht in selectedIds)
  const available = useMemo(() => {
    return allOrigins.filter((o) => !selectedIds.includes(o.id));
  }, [allOrigins, selectedIds]);

  // Berechne, wer rechts steht
  const selected = useMemo(() => {
    return allOrigins.filter((o) => selectedIds.includes(o.id));
  }, [allOrigins, selectedIds]);

  // Gefilterte Listen basierend auf Suchinput
  const filteredAvailable = useMemo(() => {
    if (!searchAvailable.trim()) return available;
    const query = searchAvailable.toLowerCase();
    return available.filter((item) => item.name.toLowerCase().includes(query));
  }, [available, searchAvailable]);

  const filteredSelected = useMemo(() => {
    if (!searchSelected.trim()) return selected;
    const query = searchSelected.toLowerCase();
    return selected.filter((item) => item.name.toLowerCase().includes(query));
  }, [selected, searchSelected]);

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

        {/* Suchfeld für die linke Spalte */}
        <Styles.SearchWrapper>
          <InputField
            id="search-available-origins"
            type="text"
            placeholder={t("searchPlaceholder") || "Durchsuchen..."}
            value={searchAvailable}
            onChange={(e) => setSearchAvailable(e.target.value)}
          />
        </Styles.SearchWrapper>

        <Styles.List>
          {filteredAvailable.length === 0 ? (
            <Styles.EmptyNote>
              {available.length === 0
                ? t("messages.no_more_items")
                : t("messages.no_search_results") || "Keine Treffer"}
            </Styles.EmptyNote>
          ) : (
            filteredAvailable.map((item) => (
              <Styles.Item key={item.id} onClick={() => handleMoveRight(item)} $disabled={isFull}>
                {item.imagePath && (
                  <img
                    src={item.imagePath}
                    alt={item.name}
                    width={28}
                    height={28}
                    style={{ objectFit: "contain", flexShrink: 0 }}
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      if (el.src.endsWith(".png")) {
                        el.src = el.src.replace(".png", ".jpg");
                      } else if (el.src.endsWith(".jpg")) {
                        el.src = el.src.replace(".jpg", ".webp");
                      } else {
                        el.style.display = "none";
                      }
                    }}
                  />
                )}
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

        {/* Suchfeld für die rechte Spalte (optional, falls auch hier viele Elemente ausgewählt werden) */}
        {selected.length > 5 && (
          <Styles.SearchWrapper>
            <InputField
              id="search-selected-origins"
              type="text"
              placeholder={t("searchPlaceholder") || "Durchsuchen..."}
              value={searchSelected}
              onChange={(e) => setSearchSelected(e.target.value)}
            />
          </Styles.SearchWrapper>
        )}

        <Styles.List>
          {filteredSelected.length === 0 ? (
            <Styles.EmptyNote>
              {selected.length === 0
                ? t("messages.none_selected")
                : t("messages.no_search_results") || "Keine Treffer"}
            </Styles.EmptyNote>
          ) : (
            filteredSelected.map((item) => (
              <Styles.Item key={item.id} onClick={() => handleMoveLeft(item)} $selected>
                <ChevronLeft size={16} />
                {item.imagePath && (
                  <img
                    src={item.imagePath}
                    alt={item.name}
                    width={28}
                    height={28}
                    style={{ objectFit: "contain", flexShrink: 0 }}
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      if (el.src.endsWith(".png")) {
                        el.src = el.src.replace(".png", ".jpg");
                      } else if (el.src.endsWith(".jpg")) {
                        el.src = el.src.replace(".jpg", ".webp");
                      } else {
                        el.style.display = "none";
                      }
                    }}
                  />
                )}
                <span>{item.name}</span>
              </Styles.Item>
            ))
          )}
        </Styles.List>
      </Styles.Column>
    </Styles.TransferContainer>
  );
}

