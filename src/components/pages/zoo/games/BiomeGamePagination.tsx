"use client";

import Pagination from "@/components/elements/Pagination/Pagination";
import { useGameStore } from "@/store/useGameStore";

export default function BiomeGamePagination() {
  const currentPage = useGameStore((state) => state.currentPage);
  const filteredCount = useGameStore((state) => state.filteredCount);
  const itemsPerPage = useGameStore((state) => state.itemsPerPage);
  const nextPage = useGameStore((state) => state.nextPage);
  const prevPage = useGameStore((state) => state.prevPage);

  return (
    <Pagination
      currentPage={currentPage}
      filteredCount={filteredCount}
      itemsPerPage={itemsPerPage}
      onNext={() => nextPage()}
      onPrev={() => prevPage()}
    />
  );
}
