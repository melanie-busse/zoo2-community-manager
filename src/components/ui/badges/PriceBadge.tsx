"use client";

import React from "react";
import styled from "styled-components";
import CurrencyBadge from "@/components/ui/badges/CurrencyBadge";
import ItemWrapper from "@/components/page-structure/page/ItemWrapper";

interface PriceBadgeProps {
  value: number;
  type: "Zoodollar" | "Diamond";
}

export default function PriceBadge({ value = 0, type = "Zoodollar" }: PriceBadgeProps) {
  return (
    <ItemWrapper>
      <CurrencyBadge value={value ?? 0} type={type} />
    </ItemWrapper>
  );
}
