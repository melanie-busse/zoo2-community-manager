"use client";

import Pagination from "@/components/elements/Pagination/Pagination";
import { useOriginStore } from "@/store/useOriginStore";

export default function OriginPagination() {
  const currentPage = useOriginStore((state) => state.currentPage);
  const filteredCount = useOriginStore((state) => state.filteredCount);
  const itemsPerPage = useOriginStore((state) => state.itemsPerPage);
  const nextPage = useOriginStore((state) => state.nextPage);
  const prevPage = useOriginStore((state) => state.prevPage);

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
