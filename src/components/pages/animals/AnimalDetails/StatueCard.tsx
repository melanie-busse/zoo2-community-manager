"use client";

import React from "react";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalDetails.styles";

interface StatueCardProps {
  imagePath: string;
}

export default function StatueCard({ imagePath }: StatueCardProps) {
  const tAnimal = useTranslations("animal");

  return (
    <Styles.StatueCardWrapper>
      <NextImage
        src={imagePath}
        alt={tAnimal("statue.title")}
        width={200}
        height={200}
        style={{ objectFit: "contain", borderRadius: "8px", display: "block" }}
      />
    </Styles.StatueCardWrapper>
  );
}