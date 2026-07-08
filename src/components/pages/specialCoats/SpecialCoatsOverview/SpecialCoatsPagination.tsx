"use client";

import Pagination from "@/components/elements/Pagination/Pagination";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";

export default function SpecialCoatsPagination() {
  const currentPage = useSpecialCoatStore((state) => state.currentPage);
  const filteredCount: number = useSpecialCoatStore((state) => state.filteredCount);
  const itemsPerPage = useSpecialCoatStore((state) => state.itemsPerPage);

  const nextPage = useSpecialCoatStore((state) => state.nextPage);
  const prevPage = useSpecialCoatStore((state) => state.prevPage);

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
