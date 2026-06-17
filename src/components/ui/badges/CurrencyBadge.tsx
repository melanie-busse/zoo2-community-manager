"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import FormattedNumber from "../Formatted/FormattedNumber";

export type CurrencyType = "Diamond" | "Zoodollar";

interface CurrencyBadgeProps {
  value?: number | null;
  type: CurrencyType;
  size?: number;
}

const CURRENCY_CONFIG = {
  Diamond: {
    src: "/images/currency/diamant.webp",
    defaultAlt: "Diamond",
    color: (theme: any) => theme.colors.system.info,
  },
  Zoodollar: {
    src: "/images/currency/zoodollar.webp",
    defaultAlt: "Zoodollar",
    color: (theme: any) => theme.colors.accent.light,
  },
};

export default function CurrencyBadge({ value, type, size = 20 }: CurrencyBadgeProps) {
  const config = CURRENCY_CONFIG[type];
  const hasValue = value !== undefined && value !== null;

  return (
    <Wrapper>
      {hasValue && (
        <Value $color={config.color}>
          <FormattedNumber value={value} />
        </Value>
      )}
      <NextImage src={config.src} alt={config.defaultAlt} width={size} height={size} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  vertical-align: middle;

  img {
    object-fit: contain;
    filter: drop-shadow(1px 1px 1px ${({ theme }) => theme.colors.ui.overlayDark};);
  }
`;

const Value = styled.span<{ $color: (theme: any) => string }>`
  font-weight: 700;
  font-size: 0.95rem;
  color: ${({ theme, $color }) => $color(theme)};
`;
