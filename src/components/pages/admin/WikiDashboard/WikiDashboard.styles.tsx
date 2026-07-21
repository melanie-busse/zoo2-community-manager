import styled from "styled-components";

export const BulkActionBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const BulkButton = styled.button<{ $variant: "import" | "update" | "sync" }>`
  background-color: ${({ $variant, theme }) =>
    $variant === "import"
      ? theme.colors.status.successBg
      : $variant === "sync"
        ? theme.colors.status.infoBg
        : theme.colors.status.warningBg};
  color: ${({ $variant, theme }) =>
    $variant === "import"
      ? theme.colors.status.successText
      : $variant === "sync"
        ? theme.colors.status.infoText
        : theme.colors.status.warningText};
  border: 2px solid
    ${({ $variant, theme }) =>
      $variant === "import"
        ? theme.colors.status.successText
        : $variant === "sync"
          ? theme.colors.status.infoText
          : theme.colors.status.warningText};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    opacity: 0.85;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyHint = styled.p`
  text-align: center;
  padding: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 1rem;
`;

export const ProgressText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.primary[900]};
  margin: 0;
  align-self: center;
`;

export const StatusBadge = styled.span<{ $status: "imported" | "missing" }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $status, theme }) =>
    $status === "imported" ? theme.colors.status.successBg : theme.colors.status.errorBg};
  color: ${({ $status, theme }) =>
    $status === "imported" ? theme.colors.status.successText : theme.colors.status.errorText};
`;

export const StatusBadge2 = styled.span<{ $status: "imported" | "missing" | "updated" }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $status, theme }) =>
    $status === "imported"
      ? theme.colors.status.successBg
      : $status === "updated"
        ? theme.colors.status.warningBg
        : theme.colors.status.errorBg};
  color: ${({ $status, theme }) =>
    $status === "imported"
      ? theme.colors.status.successText
      : $status === "updated"
        ? theme.colors.status.warningText
        : theme.colors.status.errorText};
`;
