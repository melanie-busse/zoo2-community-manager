"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { Animal } from "@/types/animal";
import { useAnimalStore } from "@/store/useAnimalStore";

export default function ImageBadge() {
  const animal = useAnimalStore((state) => state.selectedAnimal);
  if (!animal) return null;

  // 1. Convert Denglish schema properties to clean English paths
  const biomeName = animal.biome?.identifier;
  const animalImage = animal.image || "placeholder.png";

  const imagePath =
    animalImage === "placeholder.png"
      ? "/images/placeholder.jpg"
      : `/images/animals/${biomeName}/${animalImage}`;
  // 2. Safety check: Replace duplicate slashes with a single slash
  const cleanPath = imagePath.replace(/([^:]\/)\/+/g, "$1");

  // 3. Get translated name for accessible alt text
  const displayName = animal.animaltext?.[0]?.animalName || "Animal Image";

  return (
    <ImageContainer>
      <StyledMainImage src={cleanPath} alt={displayName} width={400} height={400} priority />
    </ImageContainer>
  );
}

// --- Styled Components ---
const ImageContainer = styled.div`
  /* 1:1 Aspect Ratio to enforce a perfect square */
  width: 100%;
  aspect-ratio: 1 / 1;
  max-width: 400px;
  margin: 0 auto;

  /* Zoo Aesthetics */
  border-radius: 20px;
  border: 2px solid #004d4d;
  background: white;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.06);

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  /* Desktop scale adjustment */
  @media (min-width: 768px) {
    width: 240px;
    height: 240px;
  }
`;

const StyledMainImage = styled(NextImage)`
  /* Completely fill the square without warping the image */
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;
