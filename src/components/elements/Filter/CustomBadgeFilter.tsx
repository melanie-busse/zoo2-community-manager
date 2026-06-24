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
}

export default function CustomBadgeFilter<T>({
  items,
  selectedValue,
  onSelectAction,
  allLabelKey,
  labelPrefixKey,
  renderBadge,
  getIdentifier,
}: CustomBadgeFilterProps<T>) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => setIsOpen(false));

  const isAllSelected = selectedValue === "all" || selectedValue === "Alle";

  const selectedItem = items.find((item) => getIdentifier(item) === selectedValue);

  return (
    <Styles.SelectWrapper ref={wrapperRef}>
      <Styles.SelectHeader onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        {isAllSelected ? (
          <span>{t("Filter." + allLabelKey)}</span>
        ) : (
          <Styles.SelectedValue>
            {selectedItem && renderBadge(selectedItem)}
            <Styles.Label>
              {labelPrefixKey && `${t("Filter." + labelPrefixKey)} `}
              {selectedValue}
            </Styles.Label>
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
            {t("Filter." + allLabelKey)}
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
                <Styles.Label>
                  {labelPrefixKey && `${t("Filter." + labelPrefixKey)} `}
                  {id}
                </Styles.Label>
              </Styles.Option>
            );
          })}
        </Styles.OptionsList>
      )}
    </Styles.SelectWrapper>
  );
}
