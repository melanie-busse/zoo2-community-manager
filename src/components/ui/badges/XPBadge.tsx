import React from "react";
import styled from "styled-components";
import FormattedNumber from "../Formatted/FormattedNumber";
import ItemWrapper from "@/components/page-structure/page/ItemWrapper";

interface XPBadgeProps {
  label?: number | null;
  size?: number;
}

export default function XPBadge({ label: value, size = 20 }: XPBadgeProps) {
  return (
    <ItemWrapper>
      {value !== undefined && value !== null && (
        <XPValue>
          <FormattedNumber value={value} />
        </XPValue>
      )}
      <StarImage src="/images/icons/star.png" alt="XP-Stars" width={size} height={size} />
    </ItemWrapper>
  );
}

const StarImage = styled.img<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  object-fit: contain;
  filter: drop-shadow(1px 1px 1px ${({ theme }) => theme.colors.ui.overlayDark});
`;

const XPValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.system.info};
`;
