"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/elements/Filter/Filter.styles";
import { useClickOutside } from "@/hooks/useClickOutside";
import Chevron from "@/components/ui/icons/Chevron";

interface CustomBadgeFilterProps<T> {
  items: T[];
  selectedValue: string;
  onSelectAction: (value: string) => void;
  allLabelKey: string;
  labelPrefixKey?: string;
  renderBadge: (value: T) => React.ReactNode;
  getIdentifier: (value: T) => string;
  getLabelKey?: (value: T) => string;
  showLabel?: boolean;
  compact?: boolean;
  renderAllBadge?: () => React.ReactNode;
}

export default function SelectBoxWithImage<T>({
  items,
  selectedValue,
  onSelectAction,
  allLabelKey,
  labelPrefixKey,
  renderBadge,
  getIdentifier,
  getLabelKey, // 💡 NEU
  showLabel = true,
  compact = false,
  renderAllBadge,
}: CustomBadgeFilterProps<T>) {
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => setIsOpen(false));

  const isAllSelected = selectedValue === "all" || selectedValue === "Alle";
  const selectedItem = items.find((item) => getIdentifier(item) === selectedValue);

  const renderLabelText = (item: T) => {
    if (getLabelKey) {
      return t("filter." + getLabelKey(item));
    }
    return getIdentifier(item);
  };

  return (
    <Styles.SelectWrapper ref={wrapperRef} $compact={compact} $isOpen={isOpen}>
      <Styles.SelectHeader onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        {isAllSelected ? (
          renderAllBadge ? renderAllBadge() : <span>{showLabel ? t("filter." + allLabelKey) : "–"}</span>
        ) : (
          <Styles.SelectedValue>
            {selectedItem && renderBadge(selectedItem)}
            {showLabel && (
              <Styles.Label>
                {labelPrefixKey && `${t("filter." + labelPrefixKey)} `}
                {selectedItem ? renderLabelText(selectedItem) : selectedValue}
              </Styles.Label>
            )}
          </Styles.SelectedValue>
        )}
        <Chevron isOpen={isOpen} />
      </Styles.SelectHeader>

      {isOpen && (
        <Styles.OptionsList>
          <Styles.Option
            onClick={() => {
              onSelectAction("all");
              setIsOpen(false);
            }}
          >
            {renderAllBadge ? renderAllBadge() : (showLabel ? t("filter." + allLabelKey) : "–")}
          </Styles.Option>

          {items.map((item) => {
            const id = getIdentifier(item);
            return (
              <Styles.Option
                key={id}
                onClick={() => {
                  onSelectAction(id);
                  setIsOpen(false);
                }}
              >
                {renderBadge(item)}
                {showLabel && (
                  <Styles.Label>
                    {labelPrefixKey && `${t("filter." + labelPrefixKey)} `}
                    {renderLabelText(item)}
                  </Styles.Label>
                )}
              </Styles.Option>
            );
          })}
        </Styles.OptionsList>
      )}
    </Styles.SelectWrapper>
  );
}
