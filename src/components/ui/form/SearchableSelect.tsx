"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import styled from "styled-components";

export interface SearchableSelectOption {
  value: string;
  label: string;
  image?: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "—",
  searchPlaceholder = "Suchen…",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const selected = options.find((o) => o.value === value);

  function selectOption(val: string) {
    onChange(val);
    setOpen(false);
    setSearch("");
  }

  return (
    <Wrapper ref={wrapperRef}>
      <Trigger type="button" onClick={() => setOpen((o) => !o)} $open={open}>
        <TriggerContent>
          {selected?.image && (
            <OptionImg src={selected.image} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />
          )}
          <TriggerLabel $empty={!selected}>{selected ? selected.label : placeholder}</TriggerLabel>
        </TriggerContent>
        <Chevron $open={open}>▾</Chevron>
      </Trigger>

      {open && (
        <Dropdown>
          <SearchInput
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
          />
          <OptionsList>
            <OptionItem onClick={() => selectOption("")} $active={value === ""}>
              <TriggerLabel $empty>{placeholder}</TriggerLabel>
            </OptionItem>
            {filtered.map((o) => (
              <OptionItem key={o.value} onClick={() => selectOption(o.value)} $active={o.value === value}>
                {o.image && (
                  <OptionImg src={o.image} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />
                )}
                <span>{o.label}</span>
              </OptionItem>
            ))}
            {filtered.length === 0 && <EmptyNote>Keine Ergebnisse</EmptyNote>}
          </OptionsList>
        </Dropdown>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Trigger = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  border: 1px solid ${({ $open }) => ($open ? "#88a04d" : "#d0dcc0")};
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
  background: white;
  cursor: pointer;
  text-align: left;
  gap: 6px;
  box-shadow: ${({ $open }) => ($open ? "0 0 0 2px rgba(136,160,77,0.15)" : "none")};
`;

const TriggerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1;
`;

const TriggerLabel = styled.span<{ $empty?: boolean }>`
  color: ${({ $empty }) => ($empty ? "#aaa" : "inherit")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Chevron = styled.span<{ $open: boolean }>`
  font-size: 0.8rem;
  color: #88a04d;
  flex-shrink: 0;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "none")};
  transition: transform 0.15s;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  border: 1px solid #d0dcc0;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-bottom: 1px solid #eee;
  font-size: 0.85rem;
  font-family: inherit;
  outline: none;
  background: #f9fbf5;

  &::placeholder {
    color: #aaa;
  }
`;

const OptionsList = styled.div`
  max-height: 220px;
  overflow-y: auto;
`;

const OptionItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "#f0f6e4" : "white")};
  font-weight: ${({ $active }) => ($active ? "600" : "normal")};

  &:hover {
    background: #f5f9ee;
  }
`;

const OptionImg = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 3px;
`;

const EmptyNote = styled.div`
  padding: 10px;
  font-size: 0.85rem;
  color: #999;
  text-align: center;
`;
