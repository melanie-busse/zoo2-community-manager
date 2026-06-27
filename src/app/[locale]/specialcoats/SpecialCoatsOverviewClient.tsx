"use client";

import React, { useEffect } from "react";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import SpecialCoatsOverviewContent from "@/components/pages/specialCoats/SpecialCoatsOverview/SpecialCoatsOverviewContent";

interface SpecialCoatsOverviewClientProps {
  initialSpecialCoats: any[];
}

export default function SpecialCoatsOverviewClient({
  initialSpecialCoats,
}: SpecialCoatsOverviewClientProps) {
  const setInitialSpecialCoats = useSpecialCoatStore((state) => state.setInitialSpecialCoats);

  useEffect(() => {
    if (initialSpecialCoats) {
      setInitialSpecialCoats(initialSpecialCoats);
    }
  }, [initialSpecialCoats, setInitialSpecialCoats]);

  return <SpecialCoatsOverviewContent />;
}
