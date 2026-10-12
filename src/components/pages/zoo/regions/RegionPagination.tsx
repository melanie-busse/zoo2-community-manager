"use client";

import Pagination from "@/components/elements/Pagination/Pagination";
import { useRegionStore } from "@/store/useRegionStore";

export default function RegionPagination() {
  const currentPage = useRegionStore((state) => state.currentPage);
  const filteredCount = useRegionStore((state) => state.filteredCount);
  const itemsPerPage = useRegionStore((state) => state.itemsPerPage);
  const nextPage = useRegionStore((state) => state.nextPage);
  const prevPage = useRegionStore((state) => state.prevPage);

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
