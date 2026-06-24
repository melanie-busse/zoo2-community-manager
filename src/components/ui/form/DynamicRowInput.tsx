"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import Tooltip from "@/components/ui/tooltip/Tooltip";
import InputField from "@/components/ui/form/InputField";
import Selectbox from "@/components/ui/form/Selectbox";
import Textarea from "./Textarea";

interface ColumnDefinition {
  key: string;
  label: string;
  type: "text" | "select" | "textarea" | string;
  $flex?: number;
  placeholder?: string;
  options?: Array<{ value: string; label: string; icon?: string }>;
}

interface DynamicRowInputProps {
  label?: string;
  rows: Array<Record<string, any> & { id: number | string }>;
  onAdd: () => void;
  disabledAdd?: boolean;
  onRemove: (id: number | string) => void;
  onChange: (id: number | string, key: string, value: string) => void;
  columns: ColumnDefinition[];
}

export default function DynamicRowInput({
  label,
  rows,
  onAdd,
  disabledAdd,
  onRemove,
  onChange,
  columns,
}: DynamicRowInputProps) {
  const tCommon = useTranslations("Common");

  const safeRows = rows || [];
  const isBlockLayout = columns.some((col) => col.type === "textarea");

  return (
    <Container>
      {label && <Label>{label}</Label>}

      {/* Header nur anzeigen, wenn wir NICHT im Block-Layout (Textarea) sind */}
      {!isBlockLayout && (
        <Header>
          {columns.map((col) => (
            <HeaderCell key={col.key} $flex={col.$flex}>
              {col.label}
            </HeaderCell>
          ))}
          <DeletePlaceholder />
        </Header>
      )}

      {safeRows.map((row) => (
        <Row key={row.id} $isBlockLayout={isBlockLayout}>
          <RowControls>
            {columns
              .filter((col) => col.type !== "textarea")
              .map((col) => (
                <Cell key={col.key} $flex={col.$flex}>
                  {col.type === "select" ? (
                    <Selectbox
                      id={`select-${row.id}-${col.key}`}
                      value={row[col.key]}
                      onChange={(e) => onChange(row.id, col.key, e.target.value)}
                      options={(col.options || []).filter((opt) => {
                        const otherRows = safeRows.filter((r) => r.id !== row.id);
                        const usedValues = otherRows.map((r) => r[col.key]);
                        return !usedValues.includes(opt.value) || opt.value === row[col.key];
                      })}
                    />
                  ) : (
                    <InputField
                      id={`input-${row.id}-${col.key}`}
                      type={col.type || "text"}
                      placeholder={col.placeholder}
                      value={row[col.key] || ""}
                      onChange={(e) => onChange(row.id, col.key, e.target.value)}
                    />
                  )}
                </Cell>
              ))}

            <Tooltip text={tCommon("tooltip.removeRow")}>
              <DeleteBtn onClick={() => onRemove(row.id)} type="button">
                🗑️
              </DeleteBtn>
            </Tooltip>
          </RowControls>

          {isBlockLayout && (
            <FullWidthTextareaWrapper>
              {columns
                .filter((col) => col.type === "textarea")
                .map((col) => (
                  <Textarea
                    key={col.key}
                    id={`textarea-${row.id}-${col.key}`}
                    $minHeight="120px"
                    placeholder={col.placeholder}
                    value={row[col.key] || ""}
                    onChange={(e) => onChange(row.id, col.key, e.target.value)}
                  />
                ))}
            </FullWidthTextareaWrapper>
          )}
        </Row>
      ))}

      <AddBtn onClick={onAdd} type="button" disabled={disabledAdd}>
        {disabledAdd ? tCommon("allLanguages") : tCommon("addRow")}
      </AddBtn>
    </Container>
  );
}

// --- Styled Components ---
const Container = styled.div`
  margin: 10px 0;
`;

const Label = styled.p`
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 8px;
  color: #5d7a2a;
`;

const Header = styled.div`
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: #88a04d;
  font-weight: bold;
  margin-bottom: 5px;
  padding: 0 5px;
`;

const HeaderCell = styled.span<{ $flex?: number }>`
  flex: ${(props) => props.$flex || 1};
`;

const DeletePlaceholder = styled.div`
  width: 30px;
`;

const RowControls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
`;

const Row = styled.div<{ $isBlockLayout?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: ${(props) => (props.$isBlockLayout ? "20px" : "12px")};

  /* Falls wir im Block-Layout sind, stylen wir es wie eine kleine zusammenhängende Karte */
  background: ${(props) => (props.$isBlockLayout ? "#f9fbf6" : "transparent")};
  padding: ${(props) => (props.$isBlockLayout ? "12px" : "0")};
  border-radius: ${(props) => (props.$isBlockLayout ? "8px" : "0")};
  border: ${(props) => (props.$isBlockLayout ? "1px solid #e6eedb" : "none")};
`;

const Cell = styled.div<{ $flex?: number }>`
  display: flex;
  flex: ${(props) => props.$flex || 1};
  align-self: stretch;
`;

const FullWidthTextareaWrapper = styled.div`
  width: 100%;

  textarea {
    width: 100%;
    resize: vertical;
  }
`;

const AddBtn = styled.button`
  background: #fdfdfd;
  border: 1px dashed #b5ce7e;
  color: #5a7024;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;
  font-size: 13px;
  margin-top: 5px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f4f9e9;
    border-color: #88a04d;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    background: #f5f5f5;
    color: #999;
    border-color: #ddd;
    cursor: not-allowed;
  }
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.5;
  transition: all 0.2s;
  width: 30px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;
