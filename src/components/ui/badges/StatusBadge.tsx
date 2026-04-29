import React from "react";
import styled, { keyframes } from "styled-components";
import { useTranslations } from "next-intl";

export function StatusBadge({ isActive }: { isActive: boolean }) {
  const t = useTranslations("contests");

  return (
    <StatusWrapper title={isActive ? t("status.running") : t("status.upcoming")}>
      <StatusDot $active={isActive} />
    </StatusWrapper>
  );
}

export const StatusWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: help;
`;

export const pulseShockwave = keyframes`
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(93, 122, 42, 0.9); }
    30% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(93, 122, 42, 0.6); }
    70% { transform: scale(1); box-shadow: 0 0 0 18px rgba(93, 122, 42, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(93, 122, 42, 0); }
`;

export const StatusDot = styled.div<{ $active: boolean }>`
  width: 12px;
  height: 12px;
  background-color: ${(props) => (props.$active ? "#5d7a2a" : "#bbb")};
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  animation: ${(props) => (props.$active ? pulseShockwave : "none")} 1.2s infinite ease-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: help;

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      background: white;
      border-radius: 50%;
      opacity: 0.8;
    }
  `}
`;