"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
  getLabel?: (value: T) => string;
  showLabel?: boolean;
  compact?: boolean;
  renderAllBadge?: () => React.ReactNode;
  renderAllOption?: () => React.ReactNode;
}

interface DropdownPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
}

export default function SelectBoxWithImage<T>({
  items,
  selectedValue,
  onSelectAction,
  allLabelKey,
  labelPrefixKey,
  renderBadge,
  getIdentifier,
  getLabelKey,
  getLabel,
  showLabel = true,
  compact = false,
  renderAllBadge,
  renderAllOption,
}: CustomBadgeFilterProps<T>) {
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => setIsOpen(false));

  const updatePosition = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropUp = spaceBelow < 270;
    setDropdownPos({
      left: rect.left + window.scrollX,
      width: rect.width,
      ...(dropUp
        ? { bottom: window.innerHeight - rect.top - window.scrollY }
        : { top: rect.bottom + window.scrollY + 8 }),
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  const isAllSelected = selectedValue === "all" || selectedValue === "Alle";
  const selectedItem = items.find((item) => getIdentifier(item) === selectedValue);

  const renderLabelText = (item: T) => {
    if (getLabel) {
      return getLabel(item);
    }
    if (getLabelKey) {
      return t("filter." + getLabelKey(item));
    }
    return getIdentifier(item);
  };

  const dropdown =
    isOpen && dropdownPos
      ? createPortal(
          <Styles.OptionsListPortal
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              left: dropdownPos.left,
              width: dropdownPos.width,
              ...(dropdownPos.top !== undefined
                ? { top: dropdownPos.top - window.scrollY }
                : { bottom: dropdownPos.bottom }),
            }}
          >
            <Styles.Option
              onClick={() => {
                onSelectAction("all");
                setIsOpen(false);
              }}
            >
              {(renderAllOption ?? renderAllBadge)?.() ?? (showLabel ? t("filter." + allLabelKey) : "–")}
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
          </Styles.OptionsListPortal>,
          document.body,
        )
      : null;

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

      {dropdown}
    </Styles.SelectWrapper>
  );
}