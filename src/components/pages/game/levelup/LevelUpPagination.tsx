"use client";

import Pagination from "@/components/elements/Pagination/Pagination";
import { useLevelStore } from "@/store/useLevelStore";

export default function LevelUpPagination() {
  const currentPage = useLevelStore((state) => state.currentPage);
  const filteredCount = useLevelStore((state) => state.filteredCount);
  const itemsPerPage = useLevelStore((state) => state.itemsPerPage);
  const nextPage = useLevelStore((state) => state.nextPage);
  const prevPage = useLevelStore((state) => state.prevPage);

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
