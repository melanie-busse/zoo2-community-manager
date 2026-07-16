import styled from "styled-components";

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
