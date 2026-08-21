"use client";

import Pagination from "@/components/elements/Pagination/Pagination";
import { useStatueStore } from "@/store/useStatueStore";

export default function StatuePagination() {
  const currentPage = useStatueStore((state) => state.currentPage);
  const filteredCount = useStatueStore((state) => state.filteredCount);
  const itemsPerPage = useStatueStore((state) => state.itemsPerPage);
  const nextPage = useStatueStore((state) => state.nextPage);
  const prevPage = useStatueStore((state) => state.prevPage);

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
