"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";

interface SpecialCoatBadgeProps {
  image: string | null | undefined;
  displayName: string;
}

export default function SpecialCoatBadge({ image, displayName }: SpecialCoatBadgeProps) {
  return (
    <ImageWrapper>
      <SpecialCoatIcon
        src={`/images/specialCoat/${image || "placeholder.png"}`}
        alt={displayName || "Special Coat"}
        width={200}
        height={200}
        style={{ objectFit: "contain" }}
      />
    </ImageWrapper>
  );
}

// --- Styled Components ---
const ImageWrapper = styled.div`
  width: 100%;
  max-width: 200px;
  aspect-ratio: 1 / 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: #fff;

  img {
    max-width: 100%;
    height: auto !important;
  }
`;

const SpecialCoatIcon = styled(NextImage)`
  border-radius: 20px;
  border: 2px solid #004d4d;
  background: white;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.06);
`;
