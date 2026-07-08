"use client";

import Pagination from "@/components/elements/Pagination/Pagination";
import { useAnimalStore } from "@/store/useAnimalStore";

export default function AnimalPagination() {
  const currentPage = useAnimalStore((state) => state.currentPage);
  const filteredCount = useAnimalStore((state) => state.filteredCount);
  const itemsPerPage = useAnimalStore((state) => state.itemsPerPage);

  const nextPage = useAnimalStore((state) => state.nextPage);
  const prevPage = useAnimalStore((state) => state.prevPage);

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
