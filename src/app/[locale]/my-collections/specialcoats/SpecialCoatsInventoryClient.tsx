"use client";

import React from "react";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import SpecialCoatsInventoryContent from "@/components/pages/my-collections/SpecialCoats/SpecialCoatsInventoryContent";

interface SpecialCoatsCollectionClientProps {
  specialCoats: any[];
}

export default function SpecialCoatsInventoryClient({
  specialCoats,
}: SpecialCoatsCollectionClientProps) {
  const setInitialSpecialCoats = useSpecialCoatStore((state) => state.setInitialSpecialCoats);
  setInitialSpecialCoats(specialCoats);

  return <SpecialCoatsInventoryContent />;
}
