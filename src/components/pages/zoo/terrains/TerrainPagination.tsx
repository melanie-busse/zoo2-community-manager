"use client";

import Pagination from "@/components/elements/Pagination/Pagination";
import { useTerrainStore } from "@/store/useTerrainStore";

export default function TerrainPagination() {
  const currentPage = useTerrainStore((state) => state.currentPage);
  const filteredCount = useTerrainStore((state) => state.filteredCount);
  const itemsPerPage = useTerrainStore((state) => state.itemsPerPage);
  const nextPage = useTerrainStore((state) => state.nextPage);
  const prevPage = useTerrainStore((state) => state.prevPage);

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
