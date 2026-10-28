"use client";

import React, { useEffect } from "react";
import { useChestBoostStore } from "@/store/useChestBoostStore";
import ChestBoostOverviewContent from "@/components/pages/chestBoosts/ChestBoostOverview/ChestBoostOverviewContent";
import type { ChestBoostListItem } from "@/types/chestBoost";

interface ChestBoostOverviewClientProps {
  initialBoosts: ChestBoostListItem[];
}

export default function ChestBoostOverviewClient({ initialBoosts }: ChestBoostOverviewClientProps) {
  const setInitialBoosts = useChestBoostStore((state) => state.setInitialBoosts);

  useEffect(() => {
    if (initialBoosts) {
      setInitialBoosts(initialBoosts);
    }
  }, [initialBoosts, setInitialBoosts]);

  return <ChestBoostOverviewContent />;
}
