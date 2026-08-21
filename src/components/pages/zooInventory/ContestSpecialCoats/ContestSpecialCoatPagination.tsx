"use client";

import Pagination from "@/components/elements/Pagination/Pagination";
import { useContestSpecialCoatStore } from "@/store/useContestSpecialCoatStore";

export default function ContestSpecialCoatPagination() {
  const currentPage = useContestSpecialCoatStore((state) => state.currentPage);
  const filteredCount = useContestSpecialCoatStore((state) => state.filteredCount);
  const itemsPerPage = useContestSpecialCoatStore((state) => state.itemsPerPage);
  const nextPage = useContestSpecialCoatStore((state) => state.nextPage);
  const prevPage = useContestSpecialCoatStore((state) => state.prevPage);

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
